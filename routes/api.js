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

// simply call the signup method, no need for 'passportJwt' to extract jwt from header
routerAuth.post('/signup', Authentication.signup);

// call the passport login strategy first, and then the signin method
routerAuth.post('/signin', passportLogin, Authentication.signin);

// for protected routes, passport to extract jwt from header, and verify it first 
// router.get('/protected', passportJwt, FooController.doSomething);

// bind above routes to become subroutes of '/auth'
routerAPI.use('/auth', routerAuth);



module.exports = routerAPI;