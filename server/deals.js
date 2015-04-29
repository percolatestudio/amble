Deals.loadDealsForUser = function(user) {
  console.log('Loading deals for ', user.profile.name);

  var deals = [];
  deals.push(Yelp.loadDeals(user.profile.lastLocation));
  deals.push(Groupon.loadDeals(user.profile.lastLocation));

  _.each(deals, function(deal) {
    var doc = _.extend({userId: user._id}, deal);
    // TODO -- add a schema a check it here?
    Deals.upsert(_.pick(doc, 'name', 'userId'), doc);
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

Meteor.methods({
  'deals/sendNearestToMe': function() {
    Meteor.users.sendNearestDeal(Meteor.userId(), true);
  }
});
