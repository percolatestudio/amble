
var watchForLocationChangesInFG = function() {
  Tracker.autorun(function() {
    var latLng = Geolocation.latLng();
    var error = Geolocation.error();
    if (latLng) {
      if (Meteor.isCordova) {
        AmbleWatch.updateLocation(latLng);
      }
      if (Meteor.userId()) {
        console.log("updating location from foreground: ", latLng);
        Meteor.users.updateLocation(Meteor.userId(), latLng);
      }
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
      userToken: Accounts._storedLoginToken(),
      location: {
        lat: location.latitude,
        lng: location.longitude
      }
    };
  
    console.log("updating location from background: ", data.location);
    HTTP.post(Router.url('geolocation'), {data: data}, function(error) {
      // 2. tell watch
      AmbleWatch.updateLocation(data.location);
      // 3. Tell bgGeo to close the bg thread
      bgGeo.finish();
    });
  };

  var fail = function() {
    console.log('bgGeo failure', arguments);
  };
  var options = {};

  bgGeo.configure(success, fail, options);
  
  document.addEventListener("pause", function() {
    console.log('cordova:pause');
    bgGeo.start();
  }, false);

  document.addEventListener("resume", function() {
    console.log('cordova:resume');
    bgGeo.stop();
  }, false);

};

var displayNotification = function(notification) {
  console.log(JSON.stringify(notification));
  var title = notification.payload.poi.name + " is only steps away!";
  var message =  notification.payload.poi.address;
  navigator.notification.alert(message, null, title, "OK");
};

Meteor.startup(function() {

  Push.addListener('startup', function(notification) {
    // Called when we start the app with a pending notification
    displayNotification(notification);
  });

  Push.addListener('message', function(notification) {
    // Called on every message
    displayNotification(notification);
  });

  if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {
      console.log("cordova:ready");

      watchForLocationChangesInFG();
      watchForLocationChangesInBG();
    });
  } else {
    watchForLocationChangesInFG();
  }
});
