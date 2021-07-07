const express = require('express');
const brainstvController = require('./../controllers/brainstvController');
const emailController = require('./../controllers/emailController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();
const reviewRouter = require('./reviewRoutes');

router.route('/sendContactForm').post(emailController.uploadContactUsAttachmentFile, emailController.mailContactForm, brainstvController.getAllShows);

// Home Page Header Search Functionality
router.route('/search').get(brainstvController.searchDocuments);

router.route('/eClassRoomQuestion').post(emailController.sendClassQuestion, brainstvController.getAllClassroom);

router.use(authController.isLoggedIn); // throwing error on all routes

// All Shows
router.route('/shows').get(brainstvController.getAllShows);

// Get Show by slug
router.get('/show/:slug', brainstvController.getShowBySlug);

// The parameters for this route come from the reviewController's createReview
/*
router.route('/shows/:showId/reviews').post(authController.protect, authController.restrictTo('clubMember'), reviewController.createReview);
*/
// This type of Code can be remedied by {MergeParams} in reviewRouter but by first
// mounting reviewRouter with require and router.use as above and below.
router.use('/shows/:showId/reviews', reviewRouter);

// TV Schecule
router.get('/tvschedule', brainstvController.getTvSchedule);

//Games
router.route('/games').get(brainstvController.getAllGames);

//Videos
router.route('/videos').get(brainstvController.getAllVideos);

//Activities
router.route('/activities').get(brainstvController.getAllActivities);
/*
// DOWNLOADS UPLOADS
router.route('/download-activity-file/:id').get(authController.protect, authController.restrictTo('clubMember'), brainstvController.downloadActivityFile);
*/
router.route('/advertising-price-list').get(brainstvController.downloadAdvertPricing);

//Take Part
router.route('/takePart').get(brainstvController.getAllTakePart);

//E-classroom
router.route('/eclassroom').get(brainstvController.getAllClassroom);
router.route('/year_1_E_Classroom').get(brainstvController.getYearOneClassroom);
router.route('/year_2_E_Classroom').get(brainstvController.getYearTwoClassroom);
router.route('/year_3_E_Classroom').get(brainstvController.getYearThreeClassroom);
router.route('/year_4_E_Classroom').get(brainstvController.getYearFourClassroom);
router.route('/year_5_E_Classroom').get(brainstvController.getYearFiveClassroom);
router.route('/year_6_E_Classroom').get(brainstvController.getYearSixClassroom);

//Newsroom
router.route('/newsupdate').get(brainstvController.getAllNewsUpdate);

//Privacy Policy
router.route('/privacy-policy').get(brainstvController.getAllPrivacyPolicy);

//Our Terms
router.route('/our-terms').get(brainstvController.getOurTerms);

//Questions and Answers
router.route('/question-and-answers').get(brainstvController.getAllFaqs);

//Contact Us
router.route('/contact-us').get(brainstvController.getContactUs);
// router.route('/sendContactForm').post(authController.protect, authController.restrictTo('clubMember'), brainstvController.sendContactForm);

//Advertise
router.route('/advertise').get(brainstvController.getAdverts);

//Shop
router.route('/shop').get(brainstvController.getShop);

module.exports = router;
