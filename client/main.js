
var watchForLocationChangesInFG = function() {
  Tracker.autorun(function() {
    var latLng = Geolocation.latLng();
    var error = Geolocation.error();
    if (latLng && Meteor.userId()) {
      console.log("updating location from foreground: ", latLng);
      Meteor.users.updateLocation(Meteor.userId(), latLng);
      AmbleWatch.updateLocation(latLng);
    }
    if (error) {
      console.log(error);
    }
  });
};

var watchForLocationChangesInBG = function() {
  var bgGeo = window.plugins.backgroundGeoLocation;

  var success = function(location) {
    // 1. rest API call (which ends up updating user)
    var data = {
      location: location,
      userToken: Accounts._storedLoginToken()
    };
  
    console.log("updating location from background: ", location);
    HTTP.post(Router.url('geolocation'), {data: data}, function(error) {
      // 2. tell watch
      AmbleWatch.updateLocation(latLng);
      // 3. Tell bgGeo to close the bg thread
      bgGeo.finish();
    });
  };

  var fail = function() {
    console.log('bgGeo failure', arguments)
  };
  var options = {};

  bgGeo.configure(success, fail, options);
  

  document.addEventListener("pause", function() {
    Log.info('cordova:pause');
    bgGeo.start();
  }, false);

  document.addEventListener("resume", function() {
    Log.info('cordova:resume');
    bgGeo.stop();
  }, false);

};

Meteor.startup(function() {

  Push.addListener('message', function(notification) {
    // Called on every message
    console.log(JSON.stringify(notification))

    navigator.notification.alert(notification.payload.poi.address, null, notification.message, "OK");
  });

  document.addEventListener("deviceready", function() {
    console.log("cordova:ready");

    watchForLocationChangesInFG();
    watchForLocationChangesInBG();
  });
});

