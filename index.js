/**
 * index.js 
 * - the main entry point for this node server app
 */


// settle dependencies
var express = require('express'),
    app = express(),
    logger = require('morgan'),
    config = require('./config.js');


// setup middleware
// log requests to console
app.use(logger('dev'));

// enable CORS from client-side
// please note that settings ACAO to '*' will normally prevent requests to supply credentials,
// i.e. (HTTP authentication, client-side SSL certificates, cookies)
// however, however it will permit us to provide a token within the HTTP header
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// start the server
var server = app.listen(config.port);
console.log('Your server is running on port ' + config.port + '.');