/*
 * api.js
 * - contains all the api related routes '/api/...'
 */



var express = require('express'),
    passport = require('./../config/passport'),
    authentication = require('./../controllers/authentication'),

    // route middleware, ensure relevant authentication upon certain route requests 
    // without the use of sessions
    requireAuth = passport.authenticate('jwt', { session: false }),
    requireLogin = passport.authenticate('local', { session: false });