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

var URL = 'https://partner-api.groupon.com/deals.json';
var didWarn = false;

Groupon = {
  loadPlaces: function(latLng) {
    if (!Meteor.settings.groupon) {
      if (!didWarn) {
        didWarn = true;
        Log.warn("FYI: Groupon is not configured.  Make sure to run the app with --settings");
      }
      return;
    }
    var params = {
      tsToken: 'US_AFF_0_' + Meteor.settings.groupon.affiliateId + '_212556_0',
      lat: latLng.lat,
      lng: latLng.lng,
      radius: 100,
      limit: 10
    };
    
    
    console.log(params);
    var results = HTTP.get(URL, {params: params});
    var deals = results.data.deals;
    
    return _.map(deals, function(deal) {
      return {
        name: deal.name,
        // location: {
        //   type: "Point",
        //   coordinates: [
        //     place.location.longitude,
        //     place.location.latitude
        //   ]
        // },
        metadata: deal
      };
    });
  }
}

