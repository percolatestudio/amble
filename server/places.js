Places.loadPlacesForUser = function(user) {
  console.log('Loading places for ', user.profile.name);

  Groupon.loadPlacesForUser(user);
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
    Meteor.users.sendNearestPlace(Meteor.userId(), true);
  }
});
