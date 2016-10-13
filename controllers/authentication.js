/*
 * authentication.js
 * - authentication controller
 * 
 * please note:
 * - http://www.restpatterns.org/HTTP_Status_Codes
 */



/*
 * settle dependencies
 */

var jwt = require('jsonwebtoken'),

    // includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions
    crypto = require('crypto'),
    User = require('./../models/User'),
    config = require('./../config'),


    /** generate jwt, valid for 3 hours */
    // generateToken = user => jwt.sign(user, config.jwtKey, { expiresIn: 3 * 60 * 60 }); // ES6
    generateToken = function (user) {
        return jwt.sign(user, config.jwtKey, { expiresIn: 3 * 60 * 60 });
    },

    /** select user info to be included in jwt */
    setUserInfo = function (req) {
        return {
            _id: req._id,
            firstName: req.profile.firstname,
            lastName: req.profile.lastName,
            email: req.email,
            role: req.role
        }
    };



/*
 * controllers
 */

/** login controller to extract relevant user info and use it to create, sign and then return jwt token */
module.exports.login = function (req, res, next) {

    // HTTP STATUS 200 - request succeeded
    var OK = 200,
        userInfo = setUserInfo(req.user);

    res.status(OK).json({
        token: 'JWT' + generateToken(userInfo),
        user: userInfo
    });
};


/** registration controller */
module.exports.register = function (req, res, next) {

    // HTTP STATUS 201 - Created - request fulfilled and resulted in a new resource being created
    // HTTP STATUS 422 - Unprocessable Entity - syntactically correct, but semantically erroneous
    var CREATED = 201,
        UNPROCESSABLE = 422;

    // registration validation
    if (!req.body.email) return res.status(UNPROCESSABLE).send({ error: 'You must enter an email address.' });
    if (!req.body.firstName || !req.body.lastName) return res.status(UNPROCESSABLE).send({ error: 'You must enter your full name.' });
    if (!req.body.password) return res.status(UNPROCESSABLE).send({ error: 'You must enter a password.' });

    // search for existing user
    User.findOne({ email: email }, function (err, existingUser) {
        var user;
        
        if (err) return next(err);
        if (existingUser) return res.status(UNPROCESSABLE).send({ error: 'The email address is already in use.' });

        // valid email and password provided, create account 
        user = new User({
            email: email,
            password: password,
            profile: { firstName: firstName, lastName: lastName }
        });

        user.save(function (err, user) {
            var userInfo;
            
            if (err) return next(err);

            // respond with jwt for newly created user
            userInfo = setUserInfo(user);
            res.status(CREATED).json({
                token: 'JWT' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
};

