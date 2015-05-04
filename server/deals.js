Deals.PER_USER_REFRESH_DELAY = 7 * 60 * 1000; // 7 minute throttle on refreshing deals

Deals.loadDealsForUser = function(user) {
  var timeSinceUpdated = new Date() - user.profile.dealsUpdatedAt;
  if (timeSinceUpdated < Deals.PER_USER_REFRESH_DELAY) {
    return;
  }
  Meteor.users.dealsUpdated(user._id);
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

Meteor.publish('deals/saved', function() {
  var self = this;
  var user = Meteor.users.findOne(self.userId);
  return Deals.find({_id: {$in: user.profile.savedDeals }});
});

Meteor.publish('deal', function(id) {
  return Deals.find(id);
});

Meteor.methods({
  'deals/sendNearestToMe': function() {
    Meteor.users.sendNearestDeal(Meteor.userId(), true);
  },
  'deals/save': function(options) {
    check(options, { dealId: String });
    Meteor.users.mutate.saveDeal(Meteor.userId(), options.dealId);
  },
  'deals/unsave': function(options) {
    check(options, { dealId: String });
    Meteor.users.mutate.unsaveDeal(Meteor.userId(), options.dealId);
  }
});
