Tracker.autorun(function() {
  var latLng = Geolocation.latLng();
  if (latLng && Meteor.userId()) {
    Meteor.users.updateLocation(Meteor.userId(), latLng);
    // tell watch
  }
});

Meteor.startup(function() {

  document.addEventListener("deviceready", function() {
    var bgGeo = window.plugins.backgroundGeoLocation;

    var success = function(location) {
      // 1. rest API call (which ends up updating user)
      var data = {
        location: location,
        userToken: Accounts._storedLoginToken()
      };
    
      HTTP.post(Router.url('geolocation'), {data: data}, function() {
        // 2. tell watch
      
        // 3. Tell bgGeo to close the bg thread
        bgGeo.finish();
      });
    };

    var fail = function() {
      console.log('bgGeo failure', arguments)
    };
    var options = {};

    bgGeo.configure(success, fail, options);

    bgGeo.start();
  });
});

