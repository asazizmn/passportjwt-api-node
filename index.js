/**
 * index.js 
 * - the main entry point for this node server app
 */


// settle dependencies
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    config = require('./config.js');


// setup middleware

// 'extended: false' uses querystring library
// but 'extended: true' uses qs library thats parses objects or any other types, 
// allowing for JSON-like experience 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// please note that CSRF attacks are a danger for session or cookie based applications
// however this application makes use of a session-less technology called JWT along with localStorage

// enable CORS from client-side
// please note that settings ACAO to '*' will normally prevent requests to supply credentials,
// i.e. (HTTP authentication, client-side SSL certificates, cookies)
// however, however it will permit us to provide a token within the HTTP header
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('port', process.env.PORT || 3000);
mongoose.connect(config.database);


// start the server
var server = app.listen(app.get('port'));
console.log('Your server is running on port ' + app.get('port') + '.');