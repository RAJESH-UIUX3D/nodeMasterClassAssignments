var http = require('http'),
	url  = require('url'),
	StringDecoder = require('string_decoder').StringDecoder;
	
var server = http.createServer(function(req,res){

  var parsedUrl = url.parse(req.url, true);

  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  var queryStringObject = parsedUrl.query;

  var method = req.method.toLowerCase();

  var headers = req.headers;

  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
  req.on('end', function() {
      buffer += decoder.end();

      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };

      chosenHandler(data,function(statusCode,payload){

        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        payload = typeof(payload) == 'object'? payload : {};

        var payloadString = JSON.stringify(payload);

        res.writeHead(statusCode);
        res.end(payloadString);
        console.log("Returning this response: ",statusCode,payloadString);

      });

  });

	});

server.listen(3001,function(){
  console.log('The server is up and running now');
});

var handlers = {};

handlers.hello = function(data,callback){
    callback(406,{'name':'Hello World, Welcome to NODEJS-Assignment1...'});
};

handlers.notFound = function(data,callback){
  callback(404);
};

handlers.sample = function(data,callback){
	callback(406,{'name':'This is the sample Data'});
	};

var router = {
  'hello' : handlers.hello,
  'sample' : handlers.sample
};