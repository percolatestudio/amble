Iron.Router.hooks.allowCors = function() {
  if (this.request.method === 'OPTIONS') {
    this.response.writeHead(200, {
      'Access-Control-Allow-Origin': 'http://meteor.local',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
  
    this.response.end();
  } else {
    this.next();
  }
}

var userForToken = function(token) {
  var hashedToken = Accounts._hashLoginToken(token);
  return Meteor.users.findOne({'services.resume.loginTokens.hashedToken': hashedToken});
}

Iron.Router.hooks.checkUserToken = function() {
  var data = this.request.body;
  if (! data.userToken) {
    this.response.statusCode = 401;
    return this.response.end();
  }
  this.request.user = userForToken(data.userToken);
  if (! this.request.user) {
    this.response.statusCode = 401;
    return this.response.end();
  }
  
  this.next();
}

var checkUserNotification = function(userId) {
  var user = Meteor.users.findOne(userId);
  
  // make sure we have the latest places
  Facebook.loadPlacesForUser(user);
  
  var latLng = user.profile.lastLocation;
  var geometry = {type: "Point", coordinates: [latLng.lng, latLng.lat]};
  
  // find the closest point within 500m of the user's currentLocation
  var place = Places.findOne({
    userId: user._id,
    coordinates: {$near: {
      $geometry: geometry,
      $maxDistance: 500
    }}
  });
  
  // if there's no POI within 500m or we already know about it, we're done
  if (! place || place._id === user.lastNotifiedPlaceId) {
    return;
  }
  
  Meteor.users.update(user._id, {$set: {lastNotifiedPlaceId: place._id}});
  console.log("Notifying", user._id, 'about', place);
  Push.send({
       from: 'push',
       title: "Check out the place!",
       text: EJSON.stringify(place),
       query: {
           // Ex. send to a specific user if using accounts:
           userId: user._id
       } // Query the appCollection
       // token: appId or token eg. "{ apn: token }"
       // tokens: array of appId's or tokens
       // payload: user data
   });
}


Router.route('geolocation', {
  path: '/api/geolocation',
  where: 'server',
  onBeforeAction: ['allowCors', 'checkUserToken'],
  action: function() {
    var data = this.request.body;
    
    var latLng = {
      lat: data.location.latitude,
      lng: data.location.longitude
    };
    console.log(latLng);
    Meteor.users.updateLocation(this.request.user._id, latLng);
    
    checkUserNotification(this.request.user._id);
    
    this.response.statusCode = 200;
    this.response.end();
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
});
