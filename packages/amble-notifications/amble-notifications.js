
AmbleNotifications = {
  sendDeal: function(userId, deal) {
    var title = "DEAL NEAR YOU";
    var message = deal.description;
    var notification = {
      from: 'Amble',
      text: {
        title: title,
        body: message
      },
      sound: "default",
      category: "default"
    };

    notification.payload = { deal: _.omit(deal, 'metadata') };
    
    console.log("Notifying", userId, _.omit(notification, 'payload'), EJSON.stringify(EJSON.stringify(notification.payload)));
    Push.appCollection.find({userId: userId}).forEach(function(app) {
      if (app && app.token.apn) {
        console.log("Sending to ", app.token.apn);
        Push.sendAPN(app.token.apn, notification);
      }
    });
  }
};
