
// Tracker.autorun(function() {
//   console.log("Getting location");
//   var latLng = Geolocation.latLng();
//   if (latLng && Meteor.userId()) {
//     Meteor.users.updateLocation(Meteor.userId(), latLng);
//     // tell watch
//   }
// });

Meteor.startup(function() {

  Push.addListener('message', function(notification) {
    // Called on every message
    console.log(JSON.stringify(notification))

    alert(notification.message);
  });

  document.addEventListener("deviceready", function() {
    console.log("MAIN IS STARTING");

    window.navigator.geolocation.getCurrentPosition(function(location) {
        console.log('Location from Phonegap');
    });
    
    var bgGeo = window.plugins.backgroundGeoLocation;

    var success = function(location) {
      // 1. rest API call (which ends up updating user)
      var data = {
        location: location,
        userToken: Accounts._storedLoginToken()
      };
    
      console.log("Making server method call to update location");
      HTTP.post(Router.url('geolocation'), {data: data}, function(error) {
        console.log("Completed server call", error);
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

    console.log("START BG GEO");
    bgGeo.start();
  });
});

