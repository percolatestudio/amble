Meteor.publish('places/list', function(latLng) {
  var self = this;
  
  var user = Meteor.users.findOne(self.userId);
  var interval = Meteor.setInterval(function() {
    Groupon.loadPlacesForUser(user);
  }, 10000);
  
  self.onStop(function() {
    Meteor.clearInterval(interval);
  });
  
  return Places.findNearby(self.userId, latLng);
});

Meteor.methods({
  'places/load': function() {
    Groupon.loadPlacesForUser(Meteor.user());
  },
  'places/sendNearestToMe': function() {
    var nearest = Places.findNearest(Meteor.userId(), Meteor.user().profile.lastLocation);
    if (nearest) {
      AmbleNotifications.sendPlace(Meteor.userId(), nearest);
    }
  }
});
