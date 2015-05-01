Template.dealInfo.helpers({
  distance: function() {
    if (!Meteor.user().profile.lastLocation) {
      return "--";
    }

    var latLng = {
      lng: this.location.coordinates[0],
      lat: this.location.coordinates[1]
    };
    var distance = Geocode.getDistanceAsCrow(Meteor.user().profile.lastLocation, latLng);
    var units = Meteor.user().profile.lastLocation.country === 'US' ? 'mi' : 'km';
    var distance = units === 'mi' ? distance / 1.6 : distance;
    return distance.toFixed(1) + units + " away";
  },
});