Template.deal.onCreated(function() {
  if (this.data) {
    this.subscribe('deal', this.data._id);
  }
});

Template.deal.helpers({
  isSaved: function() {
    return _.contains(Meteor.user().profile.savedDeals, this._id);
  },
  distance: function() {
    if (!(Meteor.user() && Meteor.user().profile.lastLocation && this.location && this.location.coordinates)) {
      return "--";
    }

    var latLng = {
      lng: this.location.coordinates[0],
      lat: this.location.coordinates[1]
    };
    var distance = Geocode.getDistanceAsCrow(Meteor.user().profile.lastLocation, latLng);
    var units = this.country === 'US' ? 'mi' : 'km';
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
  valueMetric: function() {
    return this.price ? this.price / 100 : '-' + Math.round(100 * (1.0 - (this.price / this.value))) + '%';
  },
  discount: function() {
    return Math.round(100 * (1.0 - (this.price / this.value))) + '% OFF';
  },
  currency: function() {
    return '$';
  },
  street: function() {
    if (!this.location) {
      return "--";
    }
    var cityPost = this.location.city + " " + this.location.postalCode;
    var cityInStreet = this.location.address.indexOf(cityPost);
    if (cityInStreet != -1) {
      return this.location.address.substr(0, cityInStreet);
    }
    return this.location.address;
  },
  cityState: function() {
    if (!this.location) {
      return "--";
    }
    var cityState = this.location.city;
    if (this.location.state)
      cityState += "," + this.location.state;
    return cityState;
  }
});

Template.deal.events({
  'click .js-save': function(e, template) {
    e.preventDefault();
    if (!_.contains(Meteor.user().profile.savedDeals, template.data._id)) {
      Meteor.call('deals/save', { dealId: template.data._id });
    }
    else {
      Meteor.call('deals/unsave', { dealId: template.data._id });
    }
  },
  'click .js-get-deal': function(e, template) {
    e.preventDefault();
    window.open(this.dealUrl, '_system');
  },
  'click .js-get-directions': function(e, template) {
    e.preventDefault();
    var srcAddr;
    var currentLocation = Meteor.user().profile.lastLocation;
    if (currentLocation) {
      srcAddr = "?saddr=" + currentLocation.lat + "," + currentLocation.lng;
    }
    var dstAddr = "daddr=" + encodeURIComponent(template.data.location.address);
    dstAddr = srcAddr ? "&" + dstAddr : "?" + dstAddr;
    var appleMapsUrl = "http://maps.apple.com/" + srcAddr + dstAddr;
    window.open(appleMapsUrl, '_system');
  }
});