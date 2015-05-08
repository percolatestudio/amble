var CHECK_COUNTRY_EVERY_MINS = 60;
var UPDATE_LOCATION_EVERY_SECS = 2;

var locationLastUpdated = new ReactiveVar(new Date(0));
var countryLastChecked = new ReactiveVar(new Date(0));

AmbleSubs = new ReactiveDict();

var shouldUpdateLocation = function(latLng) {
  if (!(Meteor.user() && Meteor.user().profile)) {
    //console.log("because of user");
    return false;
  }

  var lastLocation = _.pick(Meteor.user().profile.lastLocation, 'lat', 'lng');
  if (!latLng || _.isEqual(latLng, lastLocation)) {
    //console.log("because of position");
    return false;
  }

  var now = new Date();
  if (new Date(locationLastUpdated.get() + UPDATE_LOCATION_EVERY_SECS * 1000) < now) {
    //console.log("because of debounce");
    return false;
  }
  return true;
};

var shouldCheckCountry = function() {
  var now = new Date();
  return new Date(countryLastChecked.get() + CHECK_COUNTRY_EVERY_MINS * 60 * 1000) < now;
};

var getCountry = function(latLng) {
  if (shouldCheckCountry()) {
    Geocode.getCountry(latLng, function(err, country) {
      if (err) {
        console.log("Failed to find country", err);
      } else {
        Meteor.users.updateCountry(Meteor.userId(), country);
      }
    });
    countryLastChecked.set(new Date());
  }
};

var watchForLocationChangesInFG = function() {
  Tracker.autorun(function() {
    var latLng = Geolocation.latLng();
    var error = Geolocation.error();
    if (shouldUpdateLocation(latLng)) {
        if (Meteor.isCordova) {
          AmbleWatch.updateLocation(latLng);
        }
        console.log("updating location from foreground: ", latLng);
        Meteor.users.updateLocation(Meteor.userId(), latLng);
        getCountry(latLng);
        locationLastUpdated.set(new Date());
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

    if (!shouldUpdateLocation(data.location)) {
      return;
    }
    
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

var watchForDeals = function() {
  Tracker.autorun(function() {
    if (Meteor.user()) {
      var handle = Meteor.subscribe('deals/saved', function() {
        AmbleSubs.set('deals/saved', true);
      });
      if (!handle.ready()) {
        AmbleSubs.set('deals/saved', false);
      }
    }
  });

  Tracker.autorun(function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.lastLocation) {
      var latLng = Meteor.user().profile.lastLocation;
      if (latLng) {
        var handle = Meteor.subscribe('deals/list', latLng, function() {
          AmbleSubs.set('deals/list', true);
        });
        if (!handle.ready()) {
          AmbleSubs.set('deals/list', false);
        }
      }
    }
  });
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
  watchForDeals();
});
