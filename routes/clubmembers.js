const express = require('express');
const clubmemberController = require('./../controllers/clubmemberController');
const authController = require('./../controllers/authController');
const brainstvController = require('./../controllers/brainstvController');
const emailController = require('./../controllers/emailController');
const { patch } = require('./reviewRoutes');

const router = express.Router();

// Forgotten Password
router.route('/forgotten').get(clubmemberController.getForgottenForm);
router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

// Confirm Registration Email
router.get('/confirmRegistrationEmail/:id', clubmemberController.confirmRegistrationEmail);

// Get Reset Password Form
router.get('/resetPassword/:token', clubmemberController.getAccountPasswordResetForm);
// Post new Password
router.patch('/clubmemberPasswordReset/:token', authController.resetPassword);

// router.use(authController.isLoggedIn);

//  Logout
router.get('/logout', authController.logout);

// Sign in page
router.route('/login').get(clubmemberController.getLoginForm);
router.post('/login', authController.login);

//New Club member Route
router.route('/joinbrainsclub').get(clubmemberController.newMember);
router.post('/join', authController.join);

//Thank you for Registering page
router.route('/registered').get(clubmemberController.registered);

router.route('/sendActivityTakePartEmail').post(emailController.uploadActivityTakePartFile, emailController.mailActivityTakePart, brainstvController.getAllShows);

// authController.protect is a  middleware function. Since middleware runs
// runs in sequence, we can prevent repeating it for each route below
// calling it here so all routes below it are protected.
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', clubmemberController.getMe, clubmemberController.getUser);
router.patch('/updateMe', clubmemberController.uploadClubmemberPhoto, clubmemberController.resizeClubmemberPhoto, clubmemberController.updateMe);
router.delete('/deleteMe', clubmemberController.deleteMe);

//View All Club members Route
router.route('/').get(authController.restrictTo('superAdmin', 'basicAdmin'), clubmemberController.getAllClubMembers);
// router.route('/').get(authController.restrictTo('superAdmin', 'basicAdmin'), clubmemberController.getAllUsers);

//Create New User Route (Now using autController.join)
//router.route('/').post(clubmemberController.createClubMember);

// Show clubmember by id
// router.route('/:id').get(authController.restrictTo('superAdmin', 'basicAdmin'), clubmemberController.getClubMember);
router.route('/:id').get(authController.restrictTo('superAdmin', 'basicAdmin'), clubmemberController.getUser);

// Show clubmember profile by id
router.route('/profile/:id').get(authController.restrictTo('clubMember'), clubmemberController.showClubMemberProfile);

// Edit clubmember by id
router.route('/:id/edit').get(authController.restrictTo('superAdmin', 'basicAdmin'), clubmemberController.editClubMember);

// Edit clubmember profile by id
router.route('/profile/:id/edit').get(authController.restrictTo('clubMember'), clubmemberController.editClubMemberProfile);

// Update Club member by id
router.route('/:id').put(authController.restrictTo('superAdmin', 'basicAdmin'), clubmemberController.updateClubMember);

// Update Clubmember Profile by id
router.route('/profile/:id').put(authController.restrictTo('clubMember'), clubmemberController.updateClubMemberProfile);

// Delete clubmember by id
// router.use(authController.restrictTo('superAdmin', 'basicAdmin'));
router.route('/:id').delete(authController.restrictTo('superAdmin'), clubmemberController.deleteClubMember);
// router.route('/:id').patch(authController.restrictTo('superAdmin'), clubmemberController.updateUser).delete(authController.restrictTo('superAdmin'), clubmemberController.deleteUser);

module.exports = router;
