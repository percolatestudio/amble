Template.loginButton.events({
  'click .js-login': function() {
    Meteor.loginWithFacebook({
      requestPermissions: ['user_likes']
    });
  }
});