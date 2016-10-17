/*
 * index.js 
 * - the main entry point for this node server app
 * - please note that CSRF attacks are a danger for session or cookie based applications
 * - however this application makes use of a session-less technology called JWT along with localStorage
 */



/* 
 * settle requirements 
 */

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),

    config = require('./config/main'),
    routerAPI = require('./routes/api.js');



/* 
 * setup middleware i.e. connect database, set logger, etc 
 */

mongoose.connect(config.database);

// 'false' uses querystring library for shallow parsing, 
// and 'true' uses qs library for deep parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse application/json
app.use(logger('dev'));

// enable CORS from client-side 
// setting to '*' prevents requests to supply credentials 
// i.e. (HTTP authentication, client-side SSL certificates, cookies)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// bind api routes to become subroutes of '/api'
app.use('/api', routerAPI);

// define port to be 3000, or anything else provided by the environment
app.set('port', process.env.PORT || 3000);



/* 
 * start the server 
 */

app.listen(app.get('port'));
console.log('Your server is running on port ' + app.get('port') + '.');