var URL = 'https://partner-api.groupon.com/deals.json';
var didWarn = false;

Groupon = {
  loadPlacesForUser: function(user) {
    if (!Meteor.settings.groupon) {
      if (!didWarn) {
        didWarn = true;
        Log.warn("FYI: Groupon is not configured.  Make sure to run the app with --settings");
      }
      return;
    }
    var params = {
      tsToken: 'US_AFF_0_' + Meteor.settings.groupon.affiliateId + '_212556_0',
      // lat: user.profile.lastLocation.lat,
      // lng: user.profile.lastLocation.lng,
      lat: 37.7833,
      lng: -122.4167, 
      // LOL, in miles, good one groupon
      // radius: Math.round(100 / 1.6),
      // radius: 100,
      limit: 10
    };
    
    
    console.log(params);
    var results = HTTP.get(URL, {params: params});
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

