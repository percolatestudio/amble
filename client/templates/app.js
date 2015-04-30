Template.app.helpers({
  tabs: function() {
    return [ 'deals', 'saved', 'about' ];
  }
});

Template._tabItem.helpers({
  isActive: function() {
    var tabName = ''+this;
    return tabName === Session.get('activeTab');
  }
});

Template._tabItem.events({
  'click .tab-button': function(e, template) {
    e.preventDefault();
    var activeTab = template.data;
    Router.go(activeTab);
  }
});