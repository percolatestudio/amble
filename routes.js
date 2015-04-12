Router.route('geolocation', {
  path: '/api/geolocation',
  where: 'server',
  action: function() {
    console.log(this.request.body);
    
    this.response.writeHead(200, {
      'Access-Control-Allow-Origin': 'http://meteor.local',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    this.response.end('done')
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
});
