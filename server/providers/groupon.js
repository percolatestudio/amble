var US_URL = 'https://partner-api.groupon.com/deals.json';
var INT_URL = 'https://partner-int-api.groupon.com/deals.json';
var didWarn = false;

var LOCAL_CATEGORIES = _.map([
  'automotive', 'beauty-and-spas', 'things-to-do', 'food-and-drink',
  'health-and-fitness', 'home-improvement', 'local-services', 'shopping'
], function(c) { return 'category:' + c; });

Groupon = {
  loadPlacesForUser: function(user) {
    if (!Meteor.settings.groupon) {
      if (!didWarn) {
        didWarn = true;
        Log.warn("FYI: Groupon is not configured.  Make sure to run the app with --settings");
      }
      return;
    }

    var lastLocation = user.profile.lastLocation;
    var params = {
      lat: lastLocation.lat,
      lng: lastLocation.lng,
      filters: LOCAL_CATEGORIES.join(' OR '),
      radius: 100,
      limit: 10
    };

    var url;
    // If we don't know, we assume the US
    if (lastLocation.country !== 'US') {
      url = INT_URL;
      params.country_code = lastLocation.country;
      params.tsToken = lastLocation.country + '_AFF_0_' +
        Meteor.settings.groupon.intAffiliateId + '_212556_0';
    } else {
      url = US_URL;
      params.tsToken = 'US_AFF_0_' +
        Meteor.settings.groupon.usAffiliateId + '_212556_0';
    }

    console.log(params);
    var results = HTTP.get(url, {params: params});
    console.log(results);

        //
    //
    // var likes = results.data.likes.data;
    // var places = _.filter(likes, function(l) {
    //   return l.location && l.location.latitude;
    // });
    //
    // _.each(places, function(place) {
    //   var doc = {
    //     name: place.name,
    //     userId: user._id,
    //     location: {
    //       type: "Point",
    //       coordinates: [
    //         place.location.longitude,
    //         place.location.latitude
    //       ]
    //     },
    //     metadata: place
    //   };
    //
    //   Places.upsert(_.pick(doc, 'name', 'userId'), doc);
    // });
  }
}

