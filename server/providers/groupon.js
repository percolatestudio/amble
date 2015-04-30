// announcementTitle
//   "Up to 56%  Off at Siam Orchid Traditional Thai Massage "
// dealUrl
// endAt
// largeImageUrl
// highlightsHtml
//   "<p>Experienced massage therapists use traditional deep, yoga-like stretching and rhythmic pressure or aromatherapy techniques to banish tension</p>"
// merchant.name
// shortAnnouncementTitle
//   "Traditional Thai Massage"
// title
//   "Thai Massage or Package with Optional Aromatherapy at Siam Orchid Traditional Thai Massage (Up to 56% Off)  "
// options.0.title
// options.0.discountPercent
// options.0.value.amount
// options.0.price.amount
// options.0.discount.amount
// options.0.redemptionLocations.name
// options.0.redemptionLocations.streetAddress1/2
// options.0.redemptionLocations.lat/lng

var US_URL = 'https://partner-api.groupon.com/deals.json';
var INT_URL = 'https://partner-int-api.groupon.com/deals.json';

var didWarn = false;

var LOCAL_CATEGORIES = _.map([
  'automotive', 'beauty-and-spas', 'things-to-do', 'food-and-drink',
  'health-and-fitness', 'home-improvement', 'local-services', 'shopping'
], function(c) { return 'category:' + c; });

Groupon = {
  loadDeals: function(lastLocation) {
    if (!Meteor.settings.groupon) {
      if (!didWarn) {
        didWarn = true;
        Log.warn("FYI: Groupon is not configured.  Make sure to run the app with --settings");
      }
      return;
    }

    var params = {
      lat: lastLocation.lat,
      lng: lastLocation.lng,
      filters: LOCAL_CATEGORIES.join(' OR '),
      radius: 100,
      limit: 10
    };

    var url;
    // If we don't know, we assume the US
    if (lastLocation.country && lastLocation.country !== 'US') {
      url = INT_URL;
      params.country_code = lastLocation.country;
      params.tsToken = lastLocation.country + '_AFF_0_' +
        Meteor.settings.groupon.intAffiliateId + '_212556_0';
    } else {
      url = US_URL;
      params.tsToken = 'US_AFF_0_' +
        Meteor.settings.groupon.usAffiliateId + '_212556_0';
    }

    var results = HTTP.get(url, {params: params});
    var deals = results.data.deals;

    return _.map(deals, function(deal) {
      // TODO -- one deal per option or just pick the first?
      var option = deal.options[0];
      var location = option.redemptionLocations[0];

      return {
        merchant: deal.merchant.name,
        description: deal.announcementTitle,
        location: {
          type: "Point",
          coordinates: [
            location.lng,
            location.lat
          ],
          address: location.streetAddress1,
          city: location.city,
          postalCode: location.postalCode,
          state: location.state,
          country: location.country || lastLocation.country || 'US',
        },

        dealUrl: deal.dealUrl,
        imageUrl: deal.largeImageUrl,

        value: option.value.amount,
        price: option.price.amount,
        expiry: new Date(deal.endAt),

        type: 'groupon',
        metadata: deal
      };
    });
  }
}
