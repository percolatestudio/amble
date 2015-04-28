
var yelpOAuth = null;
if (Meteor.settings.yelp) {
  var settings = Meteor.settings.yelp;
  yelpOAuth = new OAuth1Binding(_.pick(settings, 'consumerKey', 'secret'));
  yelpOAuth.accessToken = settings.accessToken;
  yelpOAuth.accessTokenSecret = settings.accessTokenSecret;
}
var URL = 'http://api.yelp.com/v2/search';
var didWarn = false;

Yelp = {
  loadPlacesForUser: function(user) {
    try {
      if (!yelpOAuth) {
        if (!didWarn) {
          didWarn = true;
          Log.warn("FYI: Yelp! is not configured.  Make sure to run the app with --settings");
        }
        return;
      }
      var latLng = user.profile.lastLocation;
      console.log('Loading places at ', latLng);
      var params = {
        ll: latLng.lat + ',' + latLng.lng,
        radius_filter: 10000,
        deals_filter: true,
        limit: 10
      };
    
      var results = yelpOAuth.get(URL, params);
      var businesses = results.data.businesses
      
      _.each(businesses, function(business) {
        var doc = {
          name: business.name,
          userId: user._id,
          location: {
            type: "Point",
            coordinates: [
              business.location.coordinate.longitude,
              business.location.coordinate.latitude
            ]
          },
          metadata: business
        };

        Places.upsert(_.pick(doc, 'name', 'userId'), doc);
      });
    }
    catch (e) {
      console.log(e.message);
    }
  }
}