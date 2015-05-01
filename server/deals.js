Deals.loadDealsForUser = function(user) {
  console.log('Loading deals for ', user.profile.name);

  var deals = [];
  var yelpDeals = Yelp.loadDeals(user.profile.lastLocation);
  var grouponDeals = Groupon.loadDeals(user.profile.lastLocation);
  if (yelpDeals) {
    deals = deals.concat(yelpDeals);
  }
  if (grouponDeals) {
    deals = deals.concat(grouponDeals);
  }

  _.each(deals, function(deal) {
    deal.userId = user._id;
    Deals.mutate.upsert(deal);
  });
};

Meteor.publish('deals/list', function(latLng) {
  var self = this;
  var user = Meteor.users.findOne(self.userId);
  Meteor.defer(function() {
    // make sure we have the latest deals
    Deals.loadDealsForUser(user);
  });

  return Deals.findNearby(self.userId, latLng);
});

Meteor.publish('deal', function(id) {
  return Deals.find(id);
});

Meteor.methods({
  'deals/sendNearestToMe': function() {
    Meteor.users.sendNearestDeal(Meteor.userId(), true);
  }
});
