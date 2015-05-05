
Meteor.users.LocationSchema = new SimpleSchema({
  lat: { type: Number, decimal: true, min: -90.0, max : 90.0, optional: true },
  lng: { type: Number, decimal: true, min: -180.0, max: 180.0, optional: true },
  country: { type: String, optional: true }
});

Meteor.users.ProfileSchema = new SimpleSchema({
  lastLocation: { type: Meteor.users.LocationSchema, defaultValue: {}, optional: true },
  lastNotifiedDealId: { type: SimpleSchema.RegEx.Id, optional: true },
  dealsUpdatedAt: { type: Date, defaultValue: new Date('2014-01-01'), optional: true }
});

Meteor.users.mutate = {
  updateProfile: function(userId, profile) {
    var ctx = Meteor.users.ProfileSchema.newContext();
    if (! ctx.validate(profile)) {
      console.log(EJSON.stringify(profile))
      console.log(ctx.invalidKeys());
      throw new Meteor.Error('invalid-profile', "The profile can't be updated",
        ctx.invalidKeys());
    }

    var update = {};
    _.each(_.keys(profile), function(key) {
      var profileKey = 'profile.' + key;
      update[profileKey] = profile[key];
    });

    Meteor.users.update(userId, { $set: update });
  },

  saveDeal: function(userId, dealId) {
    check(userId, String);
    check(dealId, String);

    var deal = Deals.findOne(dealId, { fields: { _id: 1 }});
    if (!deal) {
      throw new Meteor.Error('invalid-deal', "That deal does not exist");
    }

    var affected = Meteor.users.update({
      _id: userId,
      'profile.savedDeals': {$ne: dealId}
    }, {
      $addToSet: {'profile.savedDeals': dealId}
    });
  },

  unsaveDeal: function(userId, dealId) {
    check(userId, String);
    check(dealId, String);

    var deal = Deals.findOne(dealId, { fields: { _id: 1 }});
    if (!deal) {
      throw new Meteor.Error('invalid-deal', "That deal does not exist");
    }

    var affected = Meteor.users.update({
      _id: userId,
      'profile.savedDeals': dealId
    }, {
      $pull: {'profile.savedDeals': dealId}
    });
  }
};

Meteor.users.updateLocation = function(userId, latLng) {
  console.log('Updating user', userId, 'with location', latLng);
  Meteor.users.mutate.updateProfile(userId, {
    'lastLocation.lat': latLng.lat,
    'lastLocation.lng': latLng.lng,
  });
};

Meteor.users.updateCountry = function(userId, country) {
  console.log('Updating user', userId, 'with country', country);
  Meteor.users.mutate.updateProfile(userId, {'lastLocation.country': country});
};

Meteor.users.dealsUpdated = function(userId) {
  var updatedAt = new Date();
  console.log('Updating user', userId, 'with dealsUpdatedAt', updatedAt);
  Meteor.users.mutate.updateProfile(userId, { 'dealsUpdatedAt': updatedAt });
};

Meteor.users.sendNearestDeal = function(userId, forceSend) {
  var user = Meteor.users.findOne(userId);

  // find the closest point to the user's currentLocation
  var deal = Deals.findNearest(user.profile.lastLocation);

  // if there's no deal within 500m or we already know about it, we're done
  if (!deal || deal._id === user.profile.lastNotifiedDealId && !forceSend) {
    return;
  }

  Meteor.users.mutate.updateProfile(user._id, {lastNotifiedDealId: deal._id});

  if (forceSend) {
    // for development purposes we delay this push by a few seconds so
    // we can close the app.
    Meteor.setTimeout(function() {
      AmbleNotifications.sendDeal(user._id, deal);
    }, 3000);
  }
  else {
    AmbleNotifications.sendDeal(user._id, deal);
  }
};
