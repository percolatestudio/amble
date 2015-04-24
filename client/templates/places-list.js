Template.placesList.created = function() {
  var self = this;
  Meteor.call('places/load');  
  self.autorun(function() {
    var latLng = Meteor.user().profile.lastLocation;
    if (latLng) {
      self.subscribe('places/list', latLng);
    }
  });
};

Template.placesList.helpers({
  places: function() {
    return Places.findNearby(Meteor.userId(), Meteor.user().profile.lastLocation);
  },

  hasPlaces: function() {
    return Places.findNearby(Meteor.userId(), Meteor.user().profile.lastLocation).count() > 0;
  },

  address: function() {
    var location = this.metadata.location;
    var street = location.street ? location.street + ", ": "";
    var city = location.city ? location.city : "";
    return street + city;
  }
});

Template.placesList.events({
  'click .js-push-me': function() {
     Meteor.call('places/sendNearestToMe');
  }
});