/**
 * User.js 
 * - User Schema and Model Definition
 * - please note the mongoose schema validators in use
 */


var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profile: {
            firstName: {
                type: String
            },
            lastName: {
                type: String
            }
        },
        role: {
            type: String,
            enum: ['Member', 'Client', 'Owner', 'Admin'],
            default: 'Member'
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpress: {
            type: Date
        }
    },
    {
        timestamps: true
    });


module.exports = mongoose.model('User', UserSchema);