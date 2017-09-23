const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const User = require('../models/User');

/**
 * Create user if email, password, firstName and lastName are correct
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.firstName - The firstName of user.
 * @property {string} req.body.lastName - The lastName of user.
 * @returns {User}
 */
const register = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email: email});

    // Check if email is not already registered
    if (!existingUser) {
      let newUser = new User({
        email,
        password,
        firstName,
        lastName
      });

      // Save user on database
      const user = await newUser.save();
      res.json({
        success: true,
        message: 'User successfully created'
      });
    } else {
      const err = new APIError('This email already exist', httpStatus.BAD_REQUEST, true);
      return next(err);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Return jwt token if valid email and password
 * @property {string} req.body.email - The username of user.
 * @property {string} req.body.password - The mobileNumber of user.
 * @returns {*}
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email});

    // If user exist
    if (user) {
      // Check if credential are correct
      const passwordMatch = await user.comparePassword(password);

      // Sign jwt token
      if(passwordMatch) {
        const token = jwt.sign({
          id: user.id
        }, config.jwtSecret, {
          expiresIn: "2 days"
        });
        return res.json({
          success: true,
          message: 'Authenticated successfully',
          token
        });
      } else {
        const err = new APIError('Bad credentials', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
    } else {
      const err = new APIError('Unknow user', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login
}
