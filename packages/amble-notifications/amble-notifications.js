
AmbleNotifications = {
  sendDeal: function(userId, deal) {
    var payload = {
      poi: {
        name: deal.name,
        loc: {
          long: deal.location.coordinates[0].toString(),
          lat: deal.location.coordinates[1].toString(),
        }
      }
    };
    var location = deal.metadata && deal.metadata.location;
    if (location) {
      var street = location.street ? location.street + "\n" : "";
      var city = location.city ? location.city + ", " : "";
      var state = location.state ? location.state + "\n" : "";
      var country = location.country || "";
      var address = street + city + state + country;
      payload.poi.address = address;
    }

    console.log("Notifying", userId, EJSON.stringify(EJSON.stringify(payload)));

    var title = "DEAL NEAR YOU";
    var message = deal.name + " is only steps away!";
    var notification = {
      from: 'Amble',
      text: {
        title: title,
        body: message
      },
      payload: payload,
      sound: "default",
      category: "default"
    };

    Push.appCollection.find({userId: userId}).forEach(function(app) {
      if (app && app.token.apn) {
        console.log("Sending to ", app.token.apn);
        Push.sendAPN(app.token.apn, notification);
      }
    });
  }
};
