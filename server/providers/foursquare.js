// specials.items.0.message
//   "Check In on Foursquare and either Like our Facebook Page or mention us on Twitter whilst in store and we'll give you a 10% discount voucher"

// tips.0.startAt/createdAt -?

// venue.location.lat/lng
// venue.location.formattedAddress
//   "233 Gertrude St (Smith St)",
//     "Fitzroy VIC 3065",
//     "Australia""
// venue.name
//   "Books for Cooks"

// No obvious image (perhaps we could work this out)
// No obvious price / deal beyond the message above

var URL = 'https://api.foursquare.com/v2/venues/explore';
var VERSION = '20150424';
var didWarn = false;

Foursquare = {
  loadPlaces: function(latLng) {
    if (!Meteor.settings.foursquare) {
      if (!didWarn) {
        didWarn = true;
        Log.warn("FYI: Foursquare is not configured.  Make sure to run the app with --settings");
      }
      return;
    }
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
    
    return _.map(items, function(item) {
      return {
        name: item.venue.name,
        location: {
          type: "Point",
          coordinates: [
            item.venue.location.lng,
            item.venue.location.lat,
          ]
        },
        metadata: item
      };
    });
  }
}



