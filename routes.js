Router.route('geolocation', {
  path: '/api/geolocation',
  where: 'server',
  action: function() {
    console.log(this.request.body);
    this.response.end('done')
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
});
