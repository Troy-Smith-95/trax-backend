const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

router.route('/register').post(usersController.registerUser);

router.route('/username').post(usersController.checkUsername);

router.route('/login').post(usersController.loginUser);

module.exports = router;