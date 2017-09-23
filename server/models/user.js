const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const bcrypt = require('bcrypt');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Methods
 */

 /**
  * Crypt password before insert on database
  * @returns {}
  */
 UserSchema.pre('save', function(next) {
   var user = this;
   if (this.isModified('password') || this.isNew) {
     bcrypt.genSalt(10, (err, salt) => {
       if (err) {
         return next(err);
       }
       bcrypt.hash(user.password, salt, (err, hash) => {
         if (err) {
           return next(err);
         }
         user.password = hash;
         next();
       });
     });
   } else {
     return next();
   }
 });

 /**
  * Compare password input to password saved in database
  * @param {Password} string - The user password
  * @param {Callback} function - The callback executed.
  * @returns {Promise<boolean>}
  */
 UserSchema.methods.comparePassword = function (pw) {
   return new Promise((resolve, reject) => {
     console.log('PW', pw);
     console.log('password', this.password);
     bcrypt.compare(pw, this.password, (err, isMatch) => {
       if (err) {
         reject(err);
       }
       resolve(isMatch);
     });
   });
 };

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
