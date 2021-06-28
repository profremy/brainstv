const express = require('express');
const authController = require('./../controllers/authController');
const pollController = require('../controllers/pollController');

const router = express.Router();

router.get('/favoriteSchoolDay', pollController.getSchoolDayPoll);
router.get('/mostAdmiredParent', pollController.getMostAdmiredPoll);
router.get('/whenCanYouStop', pollController.getWhenCanYouStopPoll);

router.post('/favoriteSchoolDay', pollController.postSchoolDayPoll);
router.post('/mostAdmiredParent', pollController.postMumAndDadPoll);
router.post('/whenCanYouStop', pollController.postWhenCanYouStopPoll);

module.exports = router;
