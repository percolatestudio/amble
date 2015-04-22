
AmbleNotifications = {
  sendPlace: function(userId, place) {    
    var location = place.metadata.location;
    var street = location.street ? location.street + "\n" : "";
    var city = location.city ? location.city + "\n" : "";
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
    
    Push.send({
       from: 'push',
       title: "Something cool is nearby...",
       text: place.name + " is only steps away!",
       query: {
           // Ex. send to a specific user if using accounts:
           userId: userId
       }, // Query the appCollection
       // token: appId or token eg. "{ apn: token }"
       // tokens: array of appId's or tokens
       payload: payload
   });
  }
};