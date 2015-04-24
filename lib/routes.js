Iron.Router.hooks.allowCors = function() {
  this.response.writeHead(200, {
    'Access-Control-Allow-Origin': 'http://meteor.local',
    'Access-Control-Allow-Headers': 'Content-Type'
  });

  if (this.request.method === 'OPTIONS') {
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
  Places.loadPlacesForUser(user);
  
  // find the closest point to the user's currentLocation
  var place = Places.findNearest(user._id, user.profile.lastLocation);
  
  // if there's no POI within 500m or we already know about it, we're done
  if (! place || place._id === user.lastNotifiedPlaceId) {
    return;
  }
  
  Meteor.users.update(user._id, {$set: {lastNotifiedPlaceId: place._id}});
  AmbleNotifications.sendPlace(user._id, place);
};

Router.route('geolocation', {
  path: '/api/geolocation',
  where: 'server',
  onBeforeAction: ['allowCors', 'checkUserToken'],
  action: function() {
    var data = this.request.body;
    check(data, {
      userToken: String,
      location: {
        lat: Number,
        lng: Number
      }
    });
    
    console.log("updating location from background: ", data.location);
    Meteor.users.updateLocation(this.request.user._id, data.location);
    
    checkUserNotification(this.request.user._id);
    
    this.response.statusCode = 200;
    this.response.end();
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
});
