

Meteor.startup(function() {
  if (Meteor.isCordova) {
    AmbleWatch.watchMethod('deals', function(request) {
      console.log("deals request:", request.params);
      check(request.params, {
        deals: [String]
      });

      var deals = Deals.find({ _id: { $in: request.params.deals }}, { fields: { metadata: 0 }}).fetch();
      if (deals && deals.length) {
        request.success(deals);
      }
      else {
        request.error("no deals found");
      }
    });
  
    AmbleWatch.watchMethod('saveDeal', function(request) {
      console.log("saveDeal request:", request.params);
      check(request.params, {
        _id: String
      });
      try {
        Meteor.users.saveDeal(request.params._id);
        request.success("ok");
      }
      catch (e) {
        request.error("no deal found");
      }
    });

    AmbleWatch.watchMethod('openDeal', function(request) {
      console.log("openDeal request:", request.params);
      check(request.params, {
        _id: String
      });
      try {
        request.success("ok");
      }
      catch (e) {
        request.error("no deal found");
      }
    });
  }
})