const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../validations/auth.validation');

const authController = require('../controllers/auth.controller');

const router = express.Router();

router.route('/login')
  .post(validate(paramValidation.login), authController.login);

router.route('/register')
  .post(validate(paramValidation.register), authController.register);

module.exports = router;
