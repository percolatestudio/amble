Deals.PER_USER_REFRESH_DELAY = 7 * 60 * 1000; // 7 minute throttle on refreshing deals

Deals.loadDealsForUser = function(user, force) {
  var timeSinceUpdated = new Date() - user.dealsUpdatedAt;
  if (!user.profile.lastLocation.country) {
    Log.warn("no country for old man: " + user._id);
    return;
  }
  if (timeSinceUpdated < Deals.PER_USER_REFRESH_DELAY && !force) {
    return;
  }
  console.log('Loading deals for ', user.profile.name);
  Meteor.users.dealsUpdated(user._id);

  var deals = [];
  var yelpDeals = Yelp.loadDeals(user.profile.lastLocation);
  var grouponDeals = Groupon.loadDeals(user.profile.lastLocation);
  if (yelpDeals && yelpDeals.length) {
    deals = deals.concat(yelpDeals);
  }
  else {
    Log.warn("got no Yelp deals");
  }
  if (grouponDeals && grouponDeals.length) {
    deals = deals.concat(grouponDeals);
  }
  else {
    Log.warn("got no Groupon deals");
  }
  _.each(deals, function(deal) {
    Deals.mutate.upsert(deal);
  });
};

Meteor.publish('deals/list', function(latLng) {
  var user = Meteor.users.findOne(this.userId);
  Meteor.defer(function() {
    // make sure we have the latest deals
    Deals.loadDealsForUser(user);
  });

  return Deals.findNearby(latLng);
});

Meteor.publish('deals/saved', function() {
  return Deals.findSaved(this.userId);
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
