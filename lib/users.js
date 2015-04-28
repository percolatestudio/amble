Meteor.users.updateLocation = function(userId, latLng) {
  console.log('Updating user', userId, 'with location', latLng);
  Meteor.users.update(userId, {$set: {'profile.lastLocation': latLng}});
};

Meteor.users.sendNearestPlace = function(userId, alwaysSend) {
  var user = Meteor.users.findOne(userId);
  
  // find the closest point to the user's currentLocation
  var place = Places.findNearest(user._id, user.profile.lastLocation);
  
  // if there's no POI within 500m or we already know about it, we're done
  if (! place || place._id === user.lastNotifiedPlaceId && !alwaysSend) {
    return;
  }

  Meteor.users.update(user._id, {$set: {lastNotifiedPlaceId: place._id}});
  AmbleNotifications.sendPlace(user._id, place);
};