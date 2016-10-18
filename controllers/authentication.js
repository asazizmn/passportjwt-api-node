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
    secret = require('./../config/secret'),


    // HTTP STATUSES 
    OK = 200,               // request succeeded
    CREATED = 201,          // request fulfilled and resulted in a new resource being created
    UNAUTHORISED = 401,     // authentication credentials were missing or incorrect
    UNPROCESSABLE = 422,    // data syntactically correct, but semantically erroneous i.e. data not found


    /** generate jwt, valid for 3 hours */
    // generateToken = user => jwt.sign(user, secret.jwtKey, { expiresIn: 3 * 60 * 60 }); // ES6
    generateToken = function (user) {
        return jwt.sign(user, secret.jwtKey, { expiresIn: 3 * 60 * 60 });
    },

    /** select user info to be included in jwt, shouldn't be entire user object, an shouldn't be sensitive */
    setUserInfo = function (user) {
        return {
            _id: user._id,
            firstName: user.profile.firstname,
            lastName: user.profile.lastName,
            email: user.email,
            role: user.role
        }
    };



/*
 * controllers
 */

/** signin controller to extract relevant user info and use it to create, sign and then return jwt token */
module.exports.signin = function (req, res, next) {
    var userInfo = setUserInfo(req.user);
    res.status(OK).json({
        token: 'JWT' + generateToken(userInfo),
        user: userInfo
    });
};


/** registration controller */
module.exports.signup = function (req, res, next) {

    // registration validation
    if (!req.body.email) return res.status(UNPROCESSABLE).send({ error: 'You must enter an email address.' });
    if (!req.body.password) return res.status(UNPROCESSABLE).send({ error: 'You must enter a password.' });
    if (!req.body.firstName || !req.body.lastName) return res.status(UNPROCESSABLE).send({ error: 'You must enter your full name.' });

    // search for existing user
    User.findOne({ email: email }, function (err, foundUser) {
        var user;

        if (err) return next(err);
        if (foundUser) return res.status(UNPROCESSABLE).send({ error: 'The email address is already in use.' });

        // valid email and password provided, create account 
        user = new User({
            email: email,
            password: password,
            profile: { firstName: firstName, lastName: lastName }
        });

        user.save(function (err, savedUser) {
            var userInfo;

            if (err) return next(err);

            // respond with jwt for newly created user
            userInfo = setUserInfo(savedUser);
            res.status(CREATED).json({
                token: 'JWT' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
};


/** role authorisation controller */
module.exports.roleAuthorisation = function (role) {
    return function (req, res, next) {
        var user = req.user;

        User.findById(user._id, function (err, foundUser) {
            if (err) {
                res.status(UNPROCESSABLE).json({ error: 'No user was found.' });
                return next(err);
            }

            if (foundUser.role !== role) {
                res.status(UNAUTHORISED).json({ error: 'You are not authorised to view this content.' });
                return next('Unauthorised');
            }

            // no errors detected, continue with flow    
            return next();
        });
    }
}


// forgot password & reset password also implemented here
