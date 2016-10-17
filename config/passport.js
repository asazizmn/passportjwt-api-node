/*
 * passport.js
 * - authentication and relevant strategy configurations
 * - i.e. configuring passport to work with jwt,
 *   but the actual jwt creation happens w/in authentication.js
 * 
 * please note:
 * - 'Passport' is authentication middleware for Node.js
 * - it authenticates requests through an extensible set of plugins known as 'strategies' (i.e. Local, OpenID, Facebook, Twitter, etc)
 * - the application provides 'Passport' a request to authenticate, 
 *   and 'Passport' provides hooks for controlling what occurs when authentication succeeds or fails
 */



/* 
 * setup requirements & configurations 
 */

var passport = require('passport'),
    LocalStrategy = require('passport-local'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require('./../models/User'),
    secret = require('./../config/secret');



/* 
 * setup passport strategies 
 */

    // setup passport's local strategy to allow email (instead of username) and password authentication
    // adapted from http://passportjs.org/docs#configuration
    localOptions = { usernameField: 'email' },
    localStrategy = new LocalStrategy(localOptions, function (email, password, next) {
        User.findOne({ email: email }, function (err, user) {
            if (err) return next(err);
            if (!user) return next(null, false, { error: 'Your login details could not be verified. Please try again.' });

            user.comparePassword(password, function (err, isMatch) {
                if (err) return next(err);
                if (!isMatch) return next(null, false, { error: 'Your login details could not be verified. Please try again.' });

                return next(null, user);
            });
        });
    }),


    // now setup jwt signin strategy to allow for the return of jwt upon authentication
    // please note that 'payload' is an object literal containing the decoded JWT payload
    // adapted from https://github.com/themikenicholson/passport-jwt
    jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: secret.jwtKey
    },
    jwtStrategy = new JwtStrategy(jwtOptions, function(payload, next) {

        // payload._id vs payload.doc._id vs payload.document._id
        // check console.log(payload)

        // User.findOne({ _id: payload._id }, function(err, user) {
        User.findById(payload._id, function(err, user) {
            if (err) return next(err, false);
            if (!user) return next(null, false);

            return next(null, user);
        });
    });


passport.use(localStrategy);
passport.use(jwtStrategy);



module.exports = passport;




