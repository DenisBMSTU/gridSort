/*
var http = require('http');

var server = http.createServer(function(requrest, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello, World!");
});
server.listen(8000);
console.log('server running at 8000');*/
/*
var express = require('express'),
    cons = require('consolidate'),
    mongodb = require('mongodb');*/
var express = require('express'),
    app = express();

app.get('/', function(req, res) {
    res.send('hello world');
});

app.use(function(req, res) {
    res.sendStatus(404);
});

var server = app.listen(3000, function() {
   var port = server.address().port;
    console.log('Express server listening on port %s', port);
});