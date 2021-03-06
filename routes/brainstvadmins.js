const express = require('express');
const brainstvadminsController = require('./../controllers/brainstvadminsController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.use(authController.isLoggedIn);

//Admin User Page Route
router.route('/').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.getAdminPanel);

// DOWNLOADS UPLOADS
router.route('/download-privacy-policy').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.downloadPrivacyPolicy);
router.route('/download-terms').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.downloadTerms);
router.route('/advertising-price-list').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.downloadAdvertPricing);
router.route('/upload-file').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.getUploadFile);
router.route('/upload-app-file').post(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.uploadAppFile, brainstvadminsController.uploadAppFileHandler, brainstvadminsController.renderAdminPanel);
// router.route('/upload-app-file').post(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.saveAppFilesToDisk, brainstvadminsController.uploadAppFile, brainstvadminsController.renderAdminPanel);

// View All Admin Users Route
router.route('/viewAdmin').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.getAdminUsers);

// View All Reviews Route
router.route('/reviews').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.getAllReviews);

// View All Discussion/Messaging Route
router.route('/discussions').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.getAllDiscussions);

//New Admin User Route
router.route('/new').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.newAdminUser);

//Create Admin User Route
//router.route('/').post(authController.protect, brainstvadminsController.createAdminUser);
//router.route('/join').post(brainstvadminsController.createAdminUser);
router.post('/createNewAdminUser', authController.protect, authController.restrictTo('superAdmin'), authController.createNewAdminUser);

// Live Stream Page Route
router.route('/livestream').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), authController.protect, brainstvadminsController.getLivestream);

//New Live stream Route
router.route('/livestream/new').get(authController.protect, authController.restrictTo('superAdmin'), authController.protect, brainstvadminsController.newLivestream);

//Create New Live stream
router.route('/livestream').post(authController.protect, brainstvadminsController.createLivestream);

//Classes Page Route
router.route('/classes').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), authController.protect, brainstvadminsController.getClasses);

//New Class Route
router.route('/classes/new').get(authController.protect, authController.restrictTo('superAdmin'), authController.protect, brainstvadminsController.newClass);

//Create New class
router.route('/classes').post(authController.protect, brainstvadminsController.createClass);

// FAQs Page Route
router.route('/faqs').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.getFaqs);

//New FAQs Route
router.route('/faqs/new').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.newFaqs);

//Create New FAQ
router.route('/faqs').post(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.createFaqs);

// Show Page Route
router.route('/shows').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.getShows);

//New Show Route
router.route('/shows/new').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.newShow);

//Create New Show
// router.route('/shows').post(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.uploadShowThumbnail, brainstvadminsController.fileUploadHandler, brainstvadminsController.createShow);
router.route('/shows').post(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.uploadShowResourceFiles, brainstvadminsController.fileUploadHandler, brainstvadminsController.createShow);

// Birthdays
// Get birthdays
router.route('/birthdays').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), authController.protect, brainstvadminsController.getBirthdays);
// New Birthday
router.route('/birthdays/new').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.newBirthday);

// Create Birthday
router.route('/birthdays').post(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.createBirthday);
// router.route('/birthdays').post(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.uploadBirthdayCard, brainstvadminsController.birthdayCardUploadHandler, brainstvadminsController.createBirthday);

//TV Schedule
//Get TV Schedule
router.route('/tvschedule').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.getTVSchedule);
// New Schedule
router.route('/tvschedule/new').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.newTVSchedule);
//Create TVSchedule
router.route('/tvschedule').post(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.createNewTVSchedule);

// Edit Update TV Schedule by id
router.route('/tvschedule/:id/edit').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.editTVSchedule);
router.route('/tvschedule/:id').put(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.updateTVSchedule);

// Edit Admin by id //
router.route('/:id/edit').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.editAdminUser);

// Edit Class by id //
router.route('/classes/:id/edit').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.editClass);

// Edit Live Stream by id //
router.route('/livestream/:id/edit').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.editLivestream);

// Edit Birthday by id //
router.route('/birthdays/:id/edit').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.editBirthday);

// Edit Faqs by id //
router.route('/faqs/:id/edit').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.editFaqs);

// Edit Show by id
router.route('/shows/:id/edit').get(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.editShow);

// Update Admin by id //
router.route('/:id').put(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.updateAdminUser);

// Update Class by id //
router.route('/classes/:id').put(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.updateClass);

// Update Live Stream by id //
router.route('/livestream/:id').put(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.updateLivestream);

// Update Birthday by id //
router.route('/birthdays/:id').put(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.updateBirthday);

// Update Faqs by id //
router.route('/faqs/:id').put(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.updateFaqs);

// Update Shows by id //
// router.route('/shows/:id').put(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.uploadShowThumbnail, brainstvadminsController.fileUploadHandler, brainstvadminsController.updateShow);
router.route('/shows/:id').put(authController.protect, authController.restrictTo('superAdmin', 'basicAdmin'), brainstvadminsController.uploadShowResourceFiles, brainstvadminsController.fileUploadHandler, brainstvadminsController.updateSlug, brainstvadminsController.updateShow);

// Delete Admin by id
router.route('/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteAdminUser);

// Delete Class by id
router.route('/classes/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteClass);

// Delete Live Stream by id
router.route('/livestream/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteLivestream);

// Delete Birthday by id
router.route('/birthdays/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteBirthday);

// Delete FAQs by id
router.route('/faqs/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteFaqs);

// Delete Show by id
router.route('/shows/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteShow);

// Delete TV Schedule by id
router.route('/tvschedule/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteTVSchedule);

// Get Favorite part of school day
router.route('/favoritePartOfSchool').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.getFavoritePartOfSchool);

router.route('/favoritePartOfSchool/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteFavoritePartOfSchoolById);

// Get mostAdmired votes
router.route('/mumAndDad').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.getMumAndDadVote);

// Get whenCanYouStop votes
router.route('/whenCanYouStop').get(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.getWhenCanYouStopVote);

router.route('/mumAndDad/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteMumAndDadVoteById);

router.route('/whenCanYouStop/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteWhenCanYouStopVoteById);

router.route('/reviews/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteMemberReview);

router.route('/discussions/:id').delete(authController.protect, authController.restrictTo('superAdmin'), brainstvadminsController.deleteMemberDiscussion);

module.exports = router;
