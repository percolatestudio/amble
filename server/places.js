Places.loadPlacesForUser = function(user) {
  Foursquare.loadPlacesForUser(user);
  Facebook.loadPlacesForUser(user);
  Yelp.loadPlacesForUser(user);
};

Meteor.publish('places/list', function(latLng) {
  var self = this;
  
  var user = Meteor.users.findOne(self.userId);
  Meteor.defer(function() {
    // make sure we have the latest places
    Places.loadPlacesForUser(user);
  });
  
  return Places.findNearby(self.userId, latLng);
});

Meteor.methods({
  'places/sendNearestToMe': function() {
    var nearest = Places.findNearest(Meteor.userId(), Meteor.user().profile.lastLocation);
    if (nearest) {
      AmbleNotifications.sendPlace(Meteor.userId(), nearest);
    }
  }
});
