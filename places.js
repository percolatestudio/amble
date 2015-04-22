Places = new Mongo.Collection('places');

Places.DEFAULT_DISTANCE_MAX = 10000; // metres

if (Meteor.isServer) {
  Places._ensureIndex({'location': '2dsphere'});
}

Places.findNearby = function(userId, latLng, maxDistance) {
  var geometry = {type: "Point", coordinates: [latLng.lng, latLng.lat]};
  maxDistance = maxDistance || Places.DEFAULT_DISTANCE_MAX;
  return Places.find({
    userId: userId,
    location: {$near: {
      $geometry: geometry,
      $maxDistance: maxDistance
    }}
  });
};

Places.findNearest = function(userId, latLng, maxDistance) {
  var geometry = {type: "Point", coordinates: [latLng.lng, latLng.lat]};
  maxDistance = maxDistance || Places.DEFAULT_DISTANCE_MAX;
  return Places.findOne({
    userId: userId,
    location: {$near: {
      $geometry: geometry,
      $maxDistance: maxDistance
    }}
  });
}