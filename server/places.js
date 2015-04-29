Places.loadPlacesForUser = function(user) {
  console.log('Loading places for ', user.profile.name);

  var places = [];
  places.push(Yelp.loadPlaces(user.profile.lastLocation));
  places.push(Groupon.loadPlaces(user.profile.lastLocation));

  _.each(places, function(place) {
    var doc = _.extend({userId: user._id}, place);
    // TODO -- add a schema a check it here?
    Places.upsert(_.pick(doc, 'name', 'userId'), doc);
  });
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
