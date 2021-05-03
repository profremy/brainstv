const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getIndex);
// router.get('/shows', authController.isLoggedIn, viewsController.getShows);
// router.get('/show/:slug', authController.isLoggedIn, viewsController.getShowBySlug);
// router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/private/account/security/details', authController.protect, viewsController.getAccount);

// router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = router;
