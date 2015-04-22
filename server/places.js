Facebook = {
  loadPlacesForUser: function(user) {
    //console.log('Loading places for ', user.profile.name);
    var url = 'https://graph.facebook.com/me?fields=likes.fields(id,name,location).limit(100)';
    var token = user.services.facebook.accessToken;
    var results = HTTP.get(url, {params: {access_token: token}});
    var likes = results.data.likes.data;
    var places = _.filter(likes, function(l) { 
      return l.location && l.location.latitude;
    });
    
    _.each(places, function(place) {
      var doc = {
        name: place.name,
        userId: user._id,
        location: {
          type: "Point",
          coordinates: [
            place.location.longitude,
            place.location.latitude
          ]
        },
        metadata: place
      };
      
      Places.upsert(_.pick(doc, 'name', 'userId'), doc);
    });
  }
}

Meteor.publish('places/list', function(latLng) {
  var self = this;
  
  var user = Meteor.users.findOne(self.userId);
  var interval = Meteor.setInterval(function() {
    Facebook.loadPlacesForUser(user);
  }, 10000);
  
  self.onStop(function() {
    Meteor.clearInterval(interval);
  });
  
  return Places.findNearby(self.userId, latLng);
});

Meteor.methods({
  'places/load': function() {
    Facebook.loadPlacesForUser(Meteor.user());
  },
  'places/sendNearestToMe': function() {
    var nearest = Places.findNearest(Meteor.userId(), Meteor.user().profile.lastLocation);
    if (nearest) {
      AmbleNotifications.sendPlace(Meteor.userId(), nearest);
    }
  }
});
