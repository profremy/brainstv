const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.isLoggedIn);

router.use(authController.protect);

router.route('/').get(reviewController.getAllReviews).post(authController.restrictTo('clubMember'), reviewController.setShowAndUserIds, reviewController.createReview);

// router.route('/:id').get(reviewController.getReview).patch(authController.restrictTo('superAdmin', 'clubMember'), reviewController.updateReview).delete(authController.restrictTo('superAdmin', 'clubMember'), reviewController.deleteReview);

router.route('/:id').get(reviewController.getReview).put(authController.restrictTo('superAdmin', 'clubMember'), reviewController.updateUserReview).delete(authController.restrictTo('superAdmin', 'clubMember'), reviewController.deleteReview);

// router.route('/:id').put(authController.restrictTo('superAdmin', 'clubMember'), reviewController.updateUserReview);

router.route('/:id/edit').get(authController.restrictTo('superAdmin', 'clubMember'), reviewController.editUserReview);

module.exports = router;
