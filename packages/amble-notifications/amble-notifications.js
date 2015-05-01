
AmbleNotifications = {
  sendDeal: function(userId, deal) {
    var payload = {
      poi: {
        name: deal.merchant,
        loc: {
          long: deal.location.coordinates[0].toString(),
          lat: deal.location.coordinates[1].toString(),
        }
      }
    };
    payload.poi.address = deal.location.address;
    
    console.log("Notifying", userId, EJSON.stringify(EJSON.stringify(payload)));

    var title = "DEAL NEAR YOU";
    var message = deal.description;
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
