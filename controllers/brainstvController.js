const Faq = require('../models/faq');
const Show = require('../models/show');
const Tvschedule = require('../models/tvschedule');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const factory = require('./handlerFactory');

//exports.getAllShows = factory.getAll(Show);
exports.getAllShows = catchAsync(async (req, res, next) => {
  let show;
  try {
    show = await Show.find({});
    res.render('brainstv/shows/index', { show, pageTitle: 'All shows' });
  } catch (e) {
    res.redirect('/');
  }
});

exports.getShowBySlug = catchAsync(async (req, res, next) => {
  let show;

  try {
    show = await Show.findOne({ slug: req.params.slug }).populate({ path: 'reviews', fields: 'review rating clubmember' });

    if (!show) {
      return next(new AppError('There is no show with that name!', 404));
    }

    res.status(200).render('brainstv/shows/show-details', { show, pageTitle: `${show.showTitle}` });
  } catch (err) {
    res.redirect('/brainstv/shows');
  }
});

exports.getShow = factory.getOne(Show, { path: 'reviews' });
// exports.getShow = catchAsync(async (req, res, next) => {
//   const show = await Show.findById(req.params.id).populate('reviews');

//   if (!show) {
//     return next(new AppError('No show found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       show: show,
//     },
//   });
// });

// exports.getTvSchedule = catchAsync(async (req, res, next) => {
//   res.status(200).render('brainstv/tvSchedule', { pageTitle: 'Tv Schedule' });
// });
exports.getTvSchedule = catchAsync(async (req, res, next) => {
  let searchOptions = {};
  if (req.query.showingName != null && req.query.showingName !== '') {
    searchOptions.showingName = new RegExp(req.query.showingName, 'i');
  }
  try {
    const tvschedule = await Tvschedule.find(searchOptions).sort({ showingStatus: -1 });
    res.status(200).render('brainstv/tvschedule', {
      tvschedule: tvschedule,
      searchOptions: req.query,
      pageTitle: 'TV Schedule',
    });
  } catch (err) {
    res.redirect('/');
  }
});

exports.getAllGames = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/games', { pageTitle: 'Games' });
});

exports.getAllVideos = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/videos', { pageTitle: 'Videos' });
});

exports.getAllActivities = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/activities', { pageTitle: 'Activities' });
});

exports.getAllTakePart = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/takepart', { pageTitle: 'Take part' });
});

exports.getAllClassroom = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/eclassroom', { pageTitle: 'E-Classroom' });
});

exports.getAllNewsUpdate = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/newsupdate', { pageTitle: 'News update' });
});

exports.getAllPrivacyPolicy = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/privacy-policy', { pageTitle: 'Privacy policy' });
});

exports.getOurTerms = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/our-terms', { pageTitle: 'Our terms and conditions' });
});

exports.getAllFaqs = catchAsync(async (req, res, next) => {
  let faq;
  try {
    faq = await Faq.find({});
    res.status(200).render('brainstv/question-and-answers', { faq: faq, pageTitle: 'Frequently Asked Questions' });
  } catch {
    res.redirect('/');
  }
});

exports.getContactUs = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/contact-us', { pageTitle: 'Contact Us' });
});

exports.getAdverts = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/advertise', { pageTitle: 'Advertise with us' });
});

exports.getShop = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstv/shop', { pageTitle: 'Shop with discounts on us' });
});
