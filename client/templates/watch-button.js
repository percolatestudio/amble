Template.watchButton.events({
  'click .js-watch': function() {
    var locData = Geolocation.latLng();
    if (locData) {
      AmbleWatch.updateLocation(locData.lat, locData.lng);
    }
  }
});