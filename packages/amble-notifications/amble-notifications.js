
AmbleNotifications = {
  sendPlace: function(userId, place) {    
    var location = place.metadata.location;
    var street = location.street ? location.street + "\n" : "";
    var city = location.city ? location.city + ", " : "";
    var state = location.state ? location.state + "\n" : "";
    var country = location.country || "";
    var address = street + city + state + country;
    var payload = {
      poi: {
        name: place.name,
        address: address,
        loc: {
          long: place.location.coordinates[0],
          lat: place.location.coordinates[1],
        }
      }
    };
    console.log("Notifying", userId, payload);
    
    var title = "Something cool is nearby...";
    var message = place.name + " is only steps away!";
    var notification = {
       from: 'Amble',
       text: { title: title, body: message},
       payload: payload,
       sound: "default"
    };

    Push.appCollection.find({userId: userId}).forEach(function(app) {
      if (app && app.token.apn) {
        Push.sendAPN(app.token.apn, notification);
      }
    });
  }
};