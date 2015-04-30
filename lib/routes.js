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
    Meteor.users.updateLocation(this.request.user._id, data.location, true);

    // make sure we have the latest deals
    Deals.loadDealsForUser(this.request.user);
    Meteor.users.sendNearestDeal(this.request.user._id);

    this.response.statusCode = 200;
    this.response.end();
  }
});

AppController = RouteController.extend({
  onBeforeAction: function () {
    Session.set('activeTab', this.url.slice(1));
    this.next();
  }
});

Router.configure({
  layoutTemplate: 'app'
});

Router.route('/', function () {
  this.redirect('/deals');
});

Router.map(function() {
  this.route('deals', { controller: 'AppController'});
  this.route('saved', { controller: 'AppController'});
  this.route('about', { controller: 'AppController'});
  this.route('deal', {path: '/deal/:id', controller: 'AppController'});
});
