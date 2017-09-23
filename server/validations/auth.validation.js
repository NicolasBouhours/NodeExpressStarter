const Joi = require('joi');

const authValidation = {
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },
  register: {
    body: {
      email: Joi.string().email().required,
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required()
    }
  }
}

module.exports = authValidation
