WatchRequest = function(options) {
  check(options.requestId, String);
  check(options.params, Object); 
  this.requestId = options.requestId;
  this.params = options.params;
  this.handler = options.handler;
};

WatchRequest.prototype.success = function(message) {
  var response = {
    requestId: this.requestId,
    success: true,
    data: message
  };
  applewatch.sendMessage(JSON.stringify(response), this.handler.responseQueueName);
};

WatchRequest.prototype.error = function(message) {
  var response = {
    requestId: this.requestId,
    success: false,
    data: message
  };
  applewatch.sendMessage(JSON.stringify(response), this.handler.responseQueueName);
};

WatchHandler = function(options) {
  check(options, {
    methodName: String,
    requestHandler: Function
  });

  this.methodName = options.methodName;
  this.handleRequest = options.requestHandler;
  this.requestQueueName = 'request.' + this.methodName;
  this.responseQueueName = 'response.' + this.methodName;
  this.listening = false;
};

WatchHandler.prototype.listen = function() {  
  if (this.listening || !AmbleWatch.ready)
    return;
  console.log("listening for watch methods on", this.requestQueueName);
  this.listening = true;
  var self = this;
  applewatch.addListener(this.requestQueueName, function(message) {
    if (message.requestId) {
      var request = new WatchRequest({
        requestId: message.requestId,
        params: message.params,
        handler: self
      });
      self.handleRequest(request);
    }
  });
};
