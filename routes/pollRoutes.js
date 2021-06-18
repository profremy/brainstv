const express = require('express');
const authController = require('./../controllers/authController');
const pollController = require('../controllers/pollController');

const router = express.Router();

router.get('/favoriteSchoolDay', pollController.getSchoolDayPoll);
router.get('/mostAdmiredParent', pollController.getMostAdmiredPoll);

router.post('/favoriteSchoolDay', pollController.postSchoolDayPoll);
router.post('/mostAdmiredParent', pollController.postMumAndDadPoll);

module.exports = router;
