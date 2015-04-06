Template.placesList.created = function() {
  var self = this;
  
  self.autorun(function() {
    var latLng = Geolocation.latLng();

    if (latLng) {
      self.subscribe('places/list', latLng);
    }
  });
};

Template.placesList.helpers({
  places: function() {
    return Places.find({userId: Meteor.userId()});
  }
});

Template.placesList.events({
  'click .js-load-places': function() {
    Meteor.call('places/load');
  }
});