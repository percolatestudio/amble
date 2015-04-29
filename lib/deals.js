Deals = new Mongo.Collection('deals');

var AddressSchema = new SimpleSchema({
  lat: { type: Number, decimal: true },
  lng: { type: Number, decimal: true },
  streetAddress: { type: String }
});


Deals.Schema = new SimpleSchema({
  merchant: { type: String },
  description: { type: String },
  address: { type: AddressSchema },

  dealUrl: { type: SimpleSchema.RegEx.Url },
  imageUrl: { type: SimpleSchema.RegEx.Url },

  value: { type: Number, decimal: true },
  price: { type: Number, decimal: true },
  expiry: { type: Date, optional: true }
});

Deals.DEFAULT_DISTANCE_MAX = 10000; // metres

if (Meteor.isServer) {
  Deals._ensureIndex({'location': '2dsphere'});
}

Deals.findNearby = function(userId, latLng, maxDistance) {
  var geometry = {type: "Point", coordinates: [latLng.lng, latLng.lat]};
  maxDistance = maxDistance || Deals.DEFAULT_DISTANCE_MAX;
  return Deals.find({
    userId: userId,
    location: {$near: {
      $geometry: geometry,
      $maxDistance: maxDistance
    }}
  }, { limit: 10 });
};

Deals.findNearest = function(userId, latLng, maxDistance) {
  var geometry = {type: "Point", coordinates: [latLng.lng, latLng.lat]};
  maxDistance = maxDistance || Deals.DEFAULT_DISTANCE_MAX;
  return Deals.findOne({
    userId: userId,
    location: {$near: {
      $geometry: geometry,
      $maxDistance: maxDistance
    }}
  });
}