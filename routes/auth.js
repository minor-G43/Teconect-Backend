const express = require('express');

const router = express.Router();

const part = require('../controllers/auth');

router.route('/register').post(part.register);

router.route('/login/:token').post(part.loginToken);

router.route('/login').post(part.login);

router.route('/forgotpassword').post(part.forgotpassword);

router.route('/fetchprofile/:authtoken').post(part.fetchProfile);

router.route('/password-reset/:resetToken').post(part.resetpassword);

router.route('/userlist/:authToken').post(part.userList);

module.exports = router;