var saved = new ReactiveVar(false);

Template.deal.onRendered(function() {
  console.log(this.data);
  saved.set(false);
});

Template.deal.helpers({
  isSaved: function() {
    return saved.get();
  },
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
    return distance.toFixed(1);
  },
  units: function() {
    return this.country === "US" ? "mi" : "km";
  },
  timeRemaining: function() {
    var totalHours = Math.round((this.expiry - new Date()) / (60*60*1000));
    var days = Math.floor(totalHours / 24);
    var hours = totalHours % 24;
    return days + 'D ' + hours + 'HR TO GO';
  },
  priceOrDiscount: function() {
    return this.price ? this.price / 100 : this.value;
  },
  discount: function() {
    return Math.round(100 * (1.0 - (this.price / this.value))) + '% OFF';
  },
  currency: function() {
    return '$';
  },
  street: function() {
    var cityPost = this.location.city + " " + this.location.postalCode;
    var cityInStreet = this.location.address.indexOf(cityPost);
    if (cityInStreet != -1) {
      return this.location.address.substr(0, cityInStreet);
    }
    return this.location.address;
  },
  cityState: function() {
    var cityState = this.location.city;
    if (this.location.state)
      cityState += "," + this.location.state;
    return cityState;
  }
});

Template.deal.events({
  'click .js-save': function(e, template) {
    e.preventDefault();
    saved.set(!saved.get());
  },
  'click .js-get-deal': function(e, template) {
    e.preventDefault();
    window.open(this.dealUrl, '_system');
  },
  'click .js-get-directions': function(e, template) {
    e.preventDefault();
    var appleMapsUrl = "http://maps.apple.com/?daddr=" + encodeURIComponent(template.data.location.address);
    window.open(appleMapsUrl, '_system');
  }
});