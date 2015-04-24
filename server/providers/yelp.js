
var settings = Meteor.settings.yelp;
var binding = new OAuth1Binding(_.pick(settings, 'consumerKey', 'secret'));
binding.accessToken = settings.accessToken;
binding.accessTokenSecret = settings.accessTokenSecret;

var URL = 'http://api.yelp.com/v2/search';

Yelp = {
  loadPlacesForUser: function(user) {
    try {
      var latLng = user.profile.lastLocation;
      console.log('Loading places at ', latLng);
      var params = {
        ll: latLng.lat + ',' + latLng.lng,
        radius_filter: 10000,
        deals_filter: true,
        limit: 10
      };
    
      var results = binding.get(URL, params);
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