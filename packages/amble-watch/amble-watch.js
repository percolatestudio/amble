
Meteor.startup(function() {
  document.addEventListener("deviceready", function() {
    AmbleWatch.init();
  });
});

var watchHandlers = [];
var subscribeHandlers = function() {
  _.each(watchHandlers, function(handler) {
    handler.listen();
  });
};

AmbleWatch = {
  ready: false,

  init: function() {
    applewatch.init(function successHandler(appGroupId) {
      AmbleWatch.ready = true;
      console.log("watch bridge initialized with appGroupId:", appGroupId);
      subscribeHandlers();
    }, function errorHandler(e) {
      console.log("watch init failed: ", e);
    });
  },


  watchMethod: function(methodName, requestHandler) {
    if (!_.findWhere(watchHandlers, {methodName: methodName})) {
      var handler = new WatchHandler({
        methodName: methodName,
        requestHandler: requestHandler
      });
      watchHandlers.push(handler);
      subscribeHandlers();
    }
  },

  updateLocation: function(latLng) {
    if (!AmbleWatch.ready) {
      return;
    }
    var locData = {
      coordinates: [latLng.lng, latLng.lat]
    };
    applewatch.sendMessage(locData, 'location', 
      function() { 
        console.log("updated watch location to ", locData);
      }, function(e) {
        console.log("error updating watch location");
        console.log(e);
    });
  },

  updateNearbyDeals: function(deals) {
    if (!AmbleWatch.ready) {
      return;
    }
    applewatch.sendMessage(EJSON.stringify({ deals: deals }), 'nearbyDeals', 
      function() { 
        console.log("updated watch nearby deals");
      }, function(e) {
        console.log("error updating watch deals");
        console.log(e);
    });
  },

  updateSavedDeals: function(deals) {
    if (!AmbleWatch.ready) {
      return;
    }
    applewatch.sendMessage(EJSON.stringify({ deals: deals }), 'savedDeals', 
      function() { 
        console.log("updated watch saved deals");
      }, function(e) {
        console.log("error updating watch deals");
        console.log(e);
    });
  }
}