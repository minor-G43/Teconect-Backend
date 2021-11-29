const express = require('express');

const router = express.Router();

const part = require('../controllers/school/controller');

router.route('/registerstu').post(part.registerStu);
router.route('/registertec').post(part.registerTec);

router.route('/login').post(part.login);

router.route('/addmarks').post(part.addmarks);
router.route('/fetchmarks').post(part.fetchmarks);

router.route('/addattendance').post(part.addattandence);
router.route('/fetchattendance').post(part.fetchattandence);

module.exports = router;