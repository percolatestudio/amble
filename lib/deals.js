Deals = new Mongo.Collection('deals');

var LocationSchema = new SimpleSchema({
  type: { type: String, allowedValues: ['Point'] },
  // long / lat
  coordinates: { type: [Number], decimal: true },
  address: { type: String }
});


Deals.Schema = new SimpleSchema({
  userId: { type: SimpleSchema.RegEx.Id },

  merchant: { type: String },
  description: { type: String },
  location: { type: LocationSchema },

  dealUrl: { type: SimpleSchema.RegEx.Url },
  imageUrl: { type: SimpleSchema.RegEx.Url },

  value: { type: Number, decimal: true },
  price: { type: Number, decimal: true },
  expiry: { type: Date, optional: true },

  // this is where we store the upstream metadata
  type: { type: String, allowedValues: ['groupon', 'yelp'] },
  metadata: { type: Object, blackbox: true }
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

Deals.mutate = {
  upsert: function(doc) {
    var ctx = Deals.Schema.newContext();
    if (! ctx.validate(doc)) {
      throw new Meteor.Error('invalid-deal', "The deal can't be inserted",
        ctx.invalidKeys());
    }

    Deals.upsert(_.pick(doc, 'merchant', 'userId'), doc);
  }
};