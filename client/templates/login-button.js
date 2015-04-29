Template.loginButton.events({
  'click .js-login': function(e) {
    e.preventDefault();
    Meteor.loginWithFacebook({
      requestPermissions: ['user_likes']
    });
  }
});