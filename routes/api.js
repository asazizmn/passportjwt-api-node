/*
 * api.js
 * - contains all the api related routes '/api/...'
 */



/*
 * setup dependencies
 */

var express = require('express'),
    routerAuth = express.Router(),
    routerAPI = express.Router(),
    passport = require('./../config/passport'),
    Authentication = require('./../controllers/authentication'),

    // define passport route middleware, plugged into route to ensure usage
    passportLogin = passport.authenticate('local', { session: false }),
    passportJwt = passport.authenticate('jwt', { session: false });



/*
 * setup routes
 */

// for '/api/auth'

// simply call the signup method, no need for 'passportJwt' to extract jwt from header
routerAuth.post('/signup', Authentication.signup);

// call the passport login strategy first, and then the signin method
routerAuth.post('/signin', passportLogin, Authentication.signin);

// bind above routes to become subroutes of '/auth'
routerAPI.use('/auth', routerAuth);


// for testing - REMOVE before production - '/api'

// for protected routes, passport to extract jwt from header, and verify it first 
// router.get('/protected', passportJwt, FooController.doSomething);

// REMOVE
routerAPI.get('/protected', passportJwt, function(req, res) {  
    res.json({success: true, message: 'It worked! User id is: ' + req.user._id + '.'});
});



module.exports = routerAPI;