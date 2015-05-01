Template.dealsList.helpers({
  dealData: function() {
    return _.extend(this, Template.parentData());
  },

  deals: function() {
    return Deals.findNearby(Meteor.userId(), Meteor.user().profile.lastLocation);
  },

  hasDeals: function() {
    return Deals.findNearby(Meteor.userId(), Meteor.user().profile.lastLocation).count() > 0;
  },

  sticker: function() {
    return this.price ? "$" + this.price / 100 : this.value;
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