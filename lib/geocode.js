var URL = 'https://maps.googleapis.com/maps/api/geocode/json';

Geocode = {
  getCountry: function(latLng, cb) {
    var param = latLng.lat + ',' + latLng.lng;
    console.log(param);
    HTTP.get(URL, {params: {latlng: param}}, function(error, result) {
      if (error || ! result || ! result.data.results.length) {
        return cb(error || new Meteor.Error('No Geocoding results'));
      }

      var address = result.data.results[0];
      var country;
      _.each(address.address_components, function(component) {
        if (component.types[0] == 'country') {
          country = component.short_name;
        }
      });

      country ? cb(null, country) : cb(new Meteor.Error('No Country Found'));
    });
  },

  getDistanceAsCrow: function(latLng1, latLng2) {
    var deg2rad = function(deg) {
      return deg * (Math.PI/180)
    }
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(latLng2.lat-latLng1.lat);  // deg2rad below
    var dLon = deg2rad(latLng2.lng-latLng1.lng); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(latLng1.lat)) * Math.cos(deg2rad(latLng2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
};