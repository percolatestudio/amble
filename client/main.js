// Tracker.autorun(function() {
//   var latLng = Geolocation.latLng();
//   if (latLng && Meteor.userId()) {
//     Meteor.users.update(Meteor.userId(), {$set: {lastLocation: latLng}});
//     // tell watch
//   }
// });

var _log = [];
Meteor.setTimeout(function() {
  console.log('Flushing log');
  _.each(_log, function(line) {
    console.log(line);
  });
  _log = [];
}, 1000);
var log = function() {
  _log.push(_.map(arguments, EJSON.stringify).join(' '));
};

Meteor.startup(function() {

  document.addEventListener("deviceready", function() {
    
    if (Meteor.isCordova) {
      
      
      // temp while the autorun is disabled
      window.navigator.geolocation.getCurrentPosition(function(location) {
        console.log('Location from Phonegap');
      });
      
      var bgGeo = window.plugins.backgroundGeoLocation;

      var success = function(location) {
        log('sending', location, 'to server');
        // 1. rest API call (which ends up updating user)
        var data = {
          location: location,
          userToken: Accounts._storedLoginToken()
        };
      
        HTTP.post(Router.url('geolocation'), {data: data}, function() {
          log('done');
          // 2. tell watch
        
          // 3. Tell bgGeo to close the bg thread
          bgGeo.finish();
        });
      };

      var fail = function() {
        log('bgGeo failure', arguments)
      };
      var options = {};

      log('starting up bgGeo');
      bgGeo.configure(success, fail, options);

      bgGeo.start();
    }
  });
});

