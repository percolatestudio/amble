var Facebook = {
  loadPlacesForUser: function(user) {
    console.log('Loading places for ', user.services.facebook.email);
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
        coordinates: [
          place.location.longitude,
          place.location.latitude
        ],
        metadata: place
      };
      
      Places.upsert(_.pick(doc, 'name', 'userId'), doc);
    });
  }
}

Meteor.publish('places/list', function(latLng) {
  var self = this;
  var geometry = {type: "Point", coordinates: [latLng.lng, latLng.lat]};
  
  var user = Meteor.users.findOne(self.userId);
  var interval = Meteor.setInterval(function() {
    Facebook.loadPlacesForUser(user);
  }, 10000);
  
  self.onStop(function() {
    Meteor.clearInterval(interval);
  });
  
  return Places.find({
    userId: self.userId,
    coordinates: {$near: {
      $geometry: geometry,
      $maxDistance: 10000 // metres
    }}
  });
});

Meteor.methods({
  'places/load': function() {
    Facebook.loadPlacesForUser(Meteor.user());
  }
});