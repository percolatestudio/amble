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
  }
};