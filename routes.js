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
    Meteor.users.updateLocation(this.request.user._id, latLng);
    
    // Send push notification if required.
    
    this.response.statusCode = 200;
    this.response.end();
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
});
