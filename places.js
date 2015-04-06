Places = new Mongo.Collection('places');

if (Meteor.isServer) {
  Places._ensureIndex({'coordinates': '2dsphere'});
}