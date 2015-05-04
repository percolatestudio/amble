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
    var currentTab = this.tabNameForRoute();
    var previousTab = Session.get('activeTab');
    Session.set('activeTab', currentTab);
    var currentTabUrlKey = currentTab + '.lastUrl';
    if (previousTab && currentTab !== previousTab) {
      var lastUrl = Session.get(currentTabUrlKey);
      console.log(previousTab + '=>' + currentTab, lastUrl);
      if (lastUrl && lastUrl !== this.url) {
        return this.redirect(lastUrl);
      }
    }
    Session.set(currentTabUrlKey, this.url);
    this.next();
  },
  showsTabs: function() { return true; },
  tabNameForRoute: function() { return this.route.getName(); },
  layoutTemplate: 'app'
});

DealController = AppController.extend({
  tabNameForRoute: function() {
    return this.params.activeTab;
  },
  showsTabs: function() { return false; },
  data: function () { return Deals.findOne(this.params._id); }
});

Router.route('/', function () {
  this.redirect('/deals');
});

Router.map(function() {
  this.route('deals', { controller: 'AppController'});
  this.route('saved', { controller: 'AppController'});
  this.route('about', { controller: 'AppController'});
  this.route('deal', {path: ':activeTab/show/:_id', controller: 'DealController'});
});
