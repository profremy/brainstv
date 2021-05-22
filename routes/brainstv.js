const express = require('express');
const brainstvController = require('./../controllers/brainstvController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();
const reviewRouter = require('./reviewRoutes');

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
router.route('/games').get(authController.protect, brainstvController.getAllGames);

//Videos
router.route('/videos').get(brainstvController.getAllVideos);

//Activities
router.route('/activities').get(brainstvController.getAllActivities);

// DOWNLOADS UPLOADS
router.route('/download-activity-file').get(authController.protect, authController.restrictTo('clubMember'), brainstvController.downloadActivityFile);

//Take Part
router.route('/takePart').get(brainstvController.getAllTakePart);

//E-classroom
router.route('/eclassroom').get(brainstvController.getAllClassroom);

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
router.route('/sendContactForm').post(authController.protect, authController.restrictTo('clubMember'), brainstvController.sendContactForm);

//Advertise
router.route('/advertise').get(brainstvController.getAdverts);

//Shop
router.route('/shop').get(brainstvController.getShop);

module.exports = router;
