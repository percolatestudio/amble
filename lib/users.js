Meteor.users.updateLocation = function(userId, latLng) {
  console.log('Updating user', userId, 'with location', latLng);
  Meteor.users.update(userId, {$set: {
    'profile.lastLocation.lat': latLng.lat,
    'profile.lastLocation.lng': latLng.lng,
  }});
};

Meteor.users.updateCountry = function(userId, country) {
  console.log('Updating user', userId, 'with country', country);
  Meteor.users.update(userId, {$set: {'profile.lastLocation.country': country}});
}

Meteor.users.sendNearestDeal = function(userId, alwaysSend) {
  var user = Meteor.users.findOne(userId);

  // find the closest point to the user's currentLocation
  var deal = Deals.findNearest(user._id, user.profile.lastLocation);

  // if there's no POI within 500m or we already know about it, we're done
  if (! deal || deal._id === user.lastNotifiedDealId && !alwaysSend) {
    return;
  }

  Meteor.users.update(user._id, {$set: {lastNotifiedDealId: deal._id}});
  AmbleNotifications.sendDeal(user._id, deal);
};