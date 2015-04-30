Template.dealsList.created = function() {
  var self = this;
  self.autorun(function() {
    if (!Meteor.user()) {
      return;
    }
    var latLng = Meteor.user().profile.lastLocation;
    if (latLng) {
      self.subscribe('deals/list', latLng);
    }
  });
};

Template.dealsList.helpers({
  deals: function() {
    return Deals.findNearby(Meteor.userId(), Meteor.user().profile.lastLocation);
  },

  hasDeals: function() {
    return Deals.findNearby(Meteor.userId(), Meteor.user().profile.lastLocation).count() > 0;
  },

  sticker: function() {
    return this.price ? "$" + this.price / 100 : this.value;
  },

  distance: function() {
    return "0.5km AWAY";
  },

  address: function() {
    return "";
    var location = this.metadata.location;
    var street = location.street ? location.street + ", ": "";
    var city = location.city ? location.city : "";
    return street + city;
  }
});

Template.dealsList.events({
  'click .js-push-me': function(e) {
    e.preventDefault();
    Meteor.call('deals/sendNearestToMe');
  }
});