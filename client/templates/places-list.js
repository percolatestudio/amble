Template.placesList.created = function() {
  this.subscribe('places/list');
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