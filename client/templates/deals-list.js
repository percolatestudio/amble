Template.dealsList.helpers({
  dealData: function() {
    return _.extend(this, Template.parentData());
  },

  saved: function() {
    return this.activeTab === "saved";
  },

  deals: function() {
    if (this.activeTab === "saved") {
      return Deals.findSaved(Meteor.userId());
    }
    else {
      return Deals.findNearby(Meteor.userId(), Meteor.user().profile.lastLocation);
    }
  },

  hasDeals: function() {
    if (this.activeTab === "saved") {
      return Deals.findSaved(Meteor.userId()).count() > 0;
    }
    else {
      return Deals.findNearby(Meteor.userId(), Meteor.user().profile.lastLocation).count() > 0;
    }
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