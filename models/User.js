/*
 * User.js 
 * - User Schema and Model Definition
 * - for details on 'BCrypt' hashing, please have a look at:
 *   https://codahale.com/how-to-safely-store-a-password/
 */



var mongoose = require('mongoose'),

    // used to handle password hashing
    bcrypt = require('bcrypt-nodejs'),

    // please note the mongoose schema validators in use
    UserSchema = new mongoose.Schema(
        {
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

            // 'enum' forces one of the specified values to be used
            role: {
                type: String,
                enum: ['Member', 'Client', 'Owner', 'Admin'],
                default: 'Member'
            }

            // TODO: password reset
            /*, resetPasswordToken: {
                type: String
            }

            , resetPasswordExpires: {
                type: Date
            }*/
        },

        {
            // this will additinally cause each user to store 'updatedAt' and 'createdAt' fields
            timestamps: true
        }
    );



/** 
 * pre-save hook, to ensure password is hashed before saving (whether new or modified) 
 * pls nt argument 'next' is a method passed while saving i.e. user.save(function(err, user) ... ) 
 */
UserSchema.pre('save', function (next) {
    var user = this,
        SALT_FACTOR = 5;

    // 'isModified' - mongoose method
    // if password unmodified, execute 'next' method, provided as argument
    if (!user.isModified('password')) return next();

    // 1st argument is the number of rounds to process the data (default is 10)
    // please note that higher the number, the longer it takes to process, but more secure
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err);

        // the salt is automatically generated and attached to the hash
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});



/** 
 * Check password on signin attempt against the hashed password stored,
 * 'next' represents the callback to execute once data has been compared 
 */
UserSchema.methods.comparePassword = function (candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return next(err);

        next(null, isMatch);
    });
}


module.exports = mongoose.model('User', UserSchema);