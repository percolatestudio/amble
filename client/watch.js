

Meteor.startup(function() {
  if (Meteor.isCordova) {

    Tracker.autorun(function() {
      if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.lastLocation && AmbleSubs.get("deals/list")) {
        var deals = Deals.findNearby(Meteor.user().profile.lastLocation);
        AmbleWatch.updateNearbyDeals(deals.fetch());
      }
    });

    Tracker.autorun(function() {
      if (Meteor.user() && Meteor.user().profile && AmbleSubs.get("deals/saved")) {
        var savedDeals = Deals.findSaved(Meteor.userId(), { fields: { _id: 1 }});
        AmbleWatch.updateSavedDeals(savedDeals.fetch());
      }
    });

    AmbleWatch.watchMethod('saveDeal', function(request) {
      console.log("saveDeal request:", request.params);
      check(request.params, {
        _id: String
      });
      Meteor.call('deals/save', { dealId: request.params._id }, function(error, result) {
        if (!error) {
          request.success(result);
        }
        else {
          request.error(error);
        }
      });
    });

    AmbleWatch.watchMethod('unsaveDeal', function(request) {
      console.log("saveDeal request:", request.params);
      check(request.params, {
        _id: String
      });
      Meteor.call('deals/unsave', { dealId: request.params._id }, function(error, result) {
        if (!error) {
          request.success(result);
        }
        else {
          request.error(error);
        }
      });
    });

    AmbleWatch.watchMethod('openDeal', function(request) {
      console.log("openDeal request:", request.params);
      check(request.params, {
        _id: String
      });
      var deal = Deals.findOne(request.params._id);
      if (deal && deal.dealUrl) {  
        window.open(deal.dealUrl, '_system');
        request.success("ok");
      }
      else {
        request.error("no deal found");
      }
    });
  }
})