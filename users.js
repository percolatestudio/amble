Meteor.users.updateLocation = function(userId, latLng) {
  console.log('Updating user', userId, 'with location', latLng);
  Meteor.users.update(userId, {$set: {'profile.lastLocation': latLng}});
};