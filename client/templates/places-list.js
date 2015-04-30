Template.placesList.created = function() {
  var self = this;
  self.autorun(function() {
    var latLng = Meteor.user().profile.lastLocation;
    if (latLng) {
      self.subscribe('deals/list', latLng);
    }
  });
};

Template.placesList.helpers({
  places: function() {
    return Deals.findNearby(Meteor.userId(), Meteor.user().profile.lastLocation);
  },

  hasPlaces: function() {
    return Deals.findNearby(Meteor.userId(), Meteor.user().profile.lastLocation).count() > 0;
  },

  address: function() {
    return "";
    var location = this.metadata.location;
    var street = location.street ? location.street + ", ": "";
    var city = location.city ? location.city : "";
    return street + city;
  }
});

Template.placesList.events({
  'click .js-push-me': function(e) {
    e.preventDefault();
    Meteor.call('places/sendNearestToMe');
  }
});