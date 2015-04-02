Meteor.publish('places/list', function() {
  return Places.find({userId: this.userId});
});

Meteor.methods({
  'places/load': function() {
    var url = 'https://graph.facebook.com/me?fields=likes.fields(id,name,location).limit(100)';
    var token = Meteor.user().services.facebook.accessToken;
    var results = HTTP.get(url, {params: {access_token: token}});
    _.each(results.data.likes.data, function(like) {
      Places.upsert(
        _.pick(like, 'id'),
        _.extend({userId: Meteor.userId()}, like)
      );
    });
  }
});