Router.route('geolocation', {
  path: '/api/geolocation',
  where: 'server',
  action: function() {
    if (this.request.method === 'OPTIONS') {
      this.response.writeHead(200, {
        'Access-Control-Allow-Origin': 'http://meteor.local',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
    
      this.response.end();
    }
    
    var data = this.request.body;
    console.log('Got request');
    console.log(data);
    
    // find the user with this login token
    // TODO : better errors?
    if (! data.userToken) {
      this.response.statusCode = 401;
      return this.response.end();
    }
    var hashedToken = Accounts._hashLoginToken(data.userToken);
    var user = Meteor.users.findOne({'services.resume.loginTokens.hashedToken': hashedToken});
    if (! user) {
      this.response.statusCode = 401;
      return this.response.end();
    }
    
    var latLng = {
      lat: data.location.latitude,
      lng: data.location.longitude
    };
    Meteor.users.updateLocation(user._id, latLng);
    
    // Send push notification if required.
    
    this.response.statusCode = 200;
    this.response.end();
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
});
