// deals.0.options.currency_code/original_price/price
// deals.0.what_you_get
// deals.0.url

// image_url - image -- pretty low quality

// location.address/display_address
// name

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
  loadDeals: function(latLng) {
    try {
      if (!yelpOAuth) {
        if (!didWarn) {
          didWarn = true;
          Log.warn("FYI: Yelp! is not configured.  Make sure to run the app with --settings");
        }
        return;
      }
      var params = {
        ll: latLng.lat + ',' + latLng.lng,
        radius_filter: 10000,
        deals_filter: true,
        limit: 10
      };

      var results = yelpOAuth.get(URL, params);
      var businesses = results.data.businesses

      return _.map(businesses, function(business) {
        var deal = business.deals[0];
        var option = deal.options[0];

        return {
          merchant: business.name,
          description: deal.what_you_get,
          location: {
            type: "Point",
            coordinates: [
              business.location.coordinate.longitude,
              business.location.coordinate.latitude
            ],
            address: business.location.address.join(' '),
            city: business.location.city,
            postalCode: business.location.postal_code,
            state: business.location.state_code,
            country: business.location.country_code
          },

          dealUrl: deal.url,
          // TODO -- low quality, find a better one?
          imageUrl: business.image_url,

          value: option.original_price,
          price: option.price,

          type: 'yelp',
          metadata: business
        };
      });
    }
    catch (e) {
      console.log(e.message);
    }
  }
}