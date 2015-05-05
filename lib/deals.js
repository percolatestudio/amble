Deals = new Mongo.Collection('deals');

var LocationSchema = new SimpleSchema({
  type: { type: String, allowedValues: ['Point'] },
  // long / lat
  coordinates: { type: [Number], decimal: true },
  address: { type: String },
  city: { type: String, optional: true },
  postalCode: { type: String },
  state: { type: String, optional: true },
  country: { type: String }
});


Deals.Schema = new SimpleSchema({
  providerId: { type: String },

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
  Meteor.startup(function() {
    Deals._ensureIndex({'location': '2dsphere'});
    Deals._ensureIndex({providerId: true}, {unique: true});
  });
}

Deals.findNearby = function(latLng, maxDistance, options) {
  var options = options || { limit: 10, fields: { metadata: 0 } };
  var geometry = {type: "Point", coordinates: [latLng.lng, latLng.lat]};
  maxDistance = maxDistance || Deals.DEFAULT_DISTANCE_MAX;
  return Deals.find({
    location: {$near: {
      $geometry: geometry,
      $maxDistance: maxDistance
    }},
    $or: [{expiry: { $gt: new Date() }}, {expiry: {$exists: false}}]
  }, options);
};

Deals.findNearest = function(latLng, maxDistance) {
  return Deals.findNearby(latLng, maxDistance, {limit: 1}).fetch()[0];
};

Deals.findSaved = function(userId) {
  var user = Meteor.users.findOne(userId);
  if (!user) {
    throw new Meteor.Error('invalid-user', "That user doesn't exist");
  }

  return Deals.find({ _id: { $in: user.profile.savedDeals || [] }}, { fields: { metatdata: 0 }});
};

Deals.mutate = {
  upsert: function(doc) {
    var ctx = Deals.Schema.newContext();
    if (! ctx.validate(doc)) {
      console.log(EJSON.stringify(doc))
      console.log(ctx.invalidKeys());
      throw new Meteor.Error('invalid-deal', "The deal can't be inserted",
        ctx.invalidKeys());
    }

    Deals.upsert(_.pick(doc, 'providerId'), doc);
  }
};