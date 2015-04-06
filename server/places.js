Meteor.publish('places/list', function(latLng) {
  var geometry = {type: "Point", coordinates: [latLng.lng, latLng.lat]};
  
  return Places.find({
    userId: this.userId,
    coordinates: {$near: {
      $geometry: geometry,
      $maxDistance: 10000 // metres
    }}
  });
});

var Facebook = {
  loadPlaces: function() {
    var url = 'https://graph.facebook.com/me?fields=likes.fields(id,name,location).limit(100)';
    var token = Meteor.user().services.facebook.accessToken;
    var results = HTTP.get(url, {params: {access_token: token}});
    var likes = results.data.likes.data;
    
    return _.filter(likes, function(l) { return l.location && l.location.latitude; });
  }
}

Meteor.methods({
  'places/load': function() {
    var places = Facebook.loadPlaces();
    _.each(places, function(place) {
      var doc = {
        name: place.name,
        userId: Meteor.userId(),
        coordinates: [
          place.location.longitude,
          place.location.latitude
        ],
        metadata: place
      };
      
      Places.upsert(_.pick(doc, 'name', 'userId'), doc);
    });
  }
});