var URL = 'https://api.foursquare.com/v2/venues/explore';
var VERSION = '20150424';
var didWarn = false;

Foursquare = {
  loadPlacesForUser: function(user) {
    if (!Meteor.settings.foursquare) {
      if (!didWarn) {
        didWarn = true;
        Log.warn("FYI: Foursquare is not configured.  Make sure to run the app with --settings");
      }
      return;
    }
    var latLng = user.profile.lastLocation;
    var params = {
      client_id: Meteor.settings.foursquare.clientId,
      client_secret: Meteor.settings.foursquare.clientSecret,
      v: VERSION,
      ll: latLng.lat + ',' + latLng.lng,
      specials: 1,
      radius: 50 * 1000,
      limit: 10
    };
    
    
    var results = HTTP.get(URL, {params: params});
    var items = _.find(results.data.response.groups, function(g) { return g.name === 'recommended'}).items;
    
    _.each(items, function(item) {
      var doc = {
        name: item.venue.name,
        userId: user._id,
        location: {
          type: "Point",
          coordinates: [
            item.venue.location.lng,
            item.venue.location.lat,
          ]
        },
        metadata: item
      };

      Places.upsert(_.pick(doc, 'name', 'userId'), doc);
    });
  }
}

