Template.app.helpers({
  showsTabs: function() {
    return Router.current().showsTabs();
  }
});

Template._tabItem.helpers({
  isActive: function() {
    var tabName = ''+this.title;
    return tabName === Session.get('activeTab');
  }
});

Template._tabItem.events({
  'click .tab-button': function(e, template) {
    e.preventDefault();
    var activeTab = template.data.title;
    Router.go(activeTab);
  }
});