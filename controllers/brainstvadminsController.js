const Admin = require('../models/brainstvadmin');
const ClubMember = require('../models/clubmember');
const ClassName = require('../models/class');
const Tvschedule = require('../models/tvschedule');
const Faq = require('../models/faq');
const Show = require('../models/show');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const factory = require('./handlerFactory');

exports.getAdminPanel = catchAsync(async (req, res, next) => {
  // Only admin users can view this route
  res.status(200).render('brainstvadmins/index', { pageTitle: 'Admin Panel' });
});

exports.getClasses = catchAsync(async (req, res, next) => {
  // Only admin users can view this route
  let searchOptions = {};
  if (req.query.className != null && req.query.className !== '') {
    searchOptions.className = new RegExp(req.query.className, 'i');
  }
  try {
    const eclass = await ClassName.find(searchOptions);
    res.render('brainstvadmins/classes/index', {
      eclass: eclass,
      searchOptions: req.query,
      pageTitle: 'Classes',
    });
  } catch {
    res.redirect('brainstvadmins');
  }
});

exports.getAdminUsers = catchAsync(async (req, res, next) => {
  let searchOptions = {};
  if (req.query.firstname != null && req.query.firstname !== '') {
    searchOptions.firstname = new RegExp(req.query.firstname, 'i');
  }
  try {
    // const admins = await Admin.find({ $text: { $search: searchOptions.userName } });
    const clubmembers = await ClubMember.find(searchOptions);
    res.render('brainstvadmins/viewAdmin', {
      clubmembers,
      searchOptions: req.query,
      pageTitle: 'Admin users',
    });
  } catch (err) {
    console.log(err);
    res.redirect('brainstvadmins');
  }
});

exports.getShows = catchAsync(async (req, res, next) => {
  // Only admin users can view this route
  let searchOptions = {};
  if (req.query.showTitle != null && req.query.showTitle !== '') {
    searchOptions.showTitle = new RegExp(req.query.showTitle, 'i');
  }
  try {
    const show = await Show.find(searchOptions).sort({ datePosted: -1 });
    res.render('brainstvadmins/shows/index', {
      show: show,
      searchOptions: req.query,
      pageTitle: 'Shows',
    });
  } catch {
    res.redirect('brainstvadmins');
  }
});

exports.newShow = catchAsync(async (req, res, next) => {
  try {
    res.render('brainstvadmins/shows/new', { show: new Show(), pageTitle: 'New show' });
  } catch (error) {
    console.log(error);
  }
});

// exports.createShow = catchAsync(async (req, res, next) => {
//   const show = await Show.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: { show: show },
//   });
// });
exports.createShow = catchAsync(async (req, res, next) => {
  const show = new Show({
    showTitle: req.body.showTitle,
    showType: req.body.showType,
    showId: req.body.showId,
    showThumbnail: req.body.showThumbnail,
    className: req.body.className,
  });

  try {
    const newShow = await show.save();
    res.redirect(`/brainstvadmins/shows`);
  } catch {
    res.render('brainstvadmins/shows/new', {
      show: show,
      errorMessage: 'Error creating show or show already exist!',
      pageTitle: 'Create Show',
    });
  }
});

//exports.createShow = factory.createOne(Show);

exports.editShow = catchAsync(async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    res.render('brainstvadmins/shows/edit', {
      show: show,
      pageTitle: 'Edit Show',
    });
  } catch {
    res.redirect('/brainstivadmins/shows');
  }
});

exports.updateShow = catchAsync(async (req, res, next) => {
  let show;

  try {
    show = await Show.findById(req.params.id);
    show.showTitle = req.body.showTitle;
    show.showType = req.body.showType;
    show.showId = req.body.showId;
    show.showThumbnail = req.body.showThumbnail;
    show.className = req.body.className;

    await show.save();
    res.redirect('/brainstvadmins/shows');
  } catch {
    res.render('brainstvadmins/shows/edit', {
      show: show,
      errorMessage: 'Error updating show. Try again!',
      pageTitle: 'Update show',
    });
  }
});

//exports.createAdminUser = factory.createOne(ClubMember);
exports.newAdminUser = catchAsync(async (req, res, next) => {
  //res.render('brainstvadmins/new', { admin: new Admin() });
  res.render('brainstvadmins/new', { admin: new ClubMember(), pageTitle: 'New Admin' });
});

// exports.createAdminUser = catchAsync(async (req, res, next) => {
//   const clumember = new ClubMember({
//     firstname: req.body.firstname,
//     firstname: req.body.firstname,
//     email: req.body.email,
//     role: req.body.role,
//     password: req.body.password,
//     confirmPassword: req.body.confirmPassword
//   });

//   try {
//     const newAdmin = await clubmember.save();
//     res.redirect(`/brainstvadmins/viewAdmin`);
//   } catch {
//     res.render('brainstvadmins/new', {
//       clubmember: clubmember,
//       errorMessage: 'Error creating admin user or admin user already exist!',
//     });
//   }
// });

// exports.createAdminUser = catchAsync(async (req, res, next) => {
//   const admin = new Admin({
//     userName: req.body.userName,
//     userEmail: req.body.userEmail,
//     adminRole: req.body.adminRole,
//     userPassword: req.body.userPassword,
//   });

//   try {
//     const newAdmin = await admin.save();
//     res.redirect(`/brainstvadmins/viewAdmin`);
//   } catch {
//     res.render('brainstvadmins/new', {
//       admin: admin,
//       errorMessage: 'Error creating admin user or admin user already exist!',
//     });
//   }
// });

exports.getTVSchedule = catchAsync(async (req, res, next) => {
  let searchOptions = {};
  if (req.query.showingName != null && req.query.showingName !== '') {
    searchOptions.showingName = new RegExp(req.query.showingName, 'i');
  }
  try {
    const tvschedule = await Tvschedule.find(searchOptions);
    res.render('brainstvadmins/tvschedule', {
      tvschedule: tvschedule,
      searchOptions: req.query,
      pageTitle: 'TV Schedule',
    });
  } catch (err) {
    res.redirect('/');
  }
});

exports.newTVSchedule = catchAsync(async (req, res, next) => {
  res.render('brainstvadmins/tvschedule/new', { tvschedule: new Tvschedule(), pageTitle: 'New TV Schedule' });
});

exports.createNewTVSchedule = catchAsync(async (req, res, next) => {
  const tvschedule = new Tvschedule({
    //startDateTime: req.body.startDateTime,
    hourSchedule: req.body.hourSchedule,
    showingName: req.body.showingName,
    showPageLink: req.body.showPageLink,
  });

  try {
    const newTvschedule = await tvschedule.save();
    res.redirect(`/brainstvadmins/tvschedule`);
  } catch (err) {
    //console.log(err);
    res.render('brainstvadmins/tvschedule/new', {
      tvschedule: tvschedule,
      errorMessage: 'Error creating TV Schedule or TV Schedule already exist!',
      pageTitle: 'New TV Schedule',
    });
  }
});

exports.editTVSchedule = catchAsync(async (req, res, next) => {
  let tvschedule;
  try {
    tvschedule = await Tvschedule.findById(req.params.id);
    res.render('brainstvadmins/tvschedule/edit', {
      tvschedule: tvschedule,
      pageTitle: 'Edit TVSchedule',
    });
  } catch {
    res.redirect('/brainstivadmins/tvschedule');
  }
});

exports.updateTVSchedule = catchAsync(async (req, res, next) => {
  let tvschedule;

  try {
    tvschedule = await Tvschedule.findById(req.params.id);
    //tvschedule.startDateTime = req.body.startDateTime;
    tvschedule.hourSchedule = req.body.hourSchedule;
    tvschedule.showingName = req.body.showingName;
    tvschedule.showPageLink = req.body.showPageLink;

    await tvschedule.save();
    res.redirect('/brainstvadmins/tvschedule');
  } catch {
    res.render('brainstvadmins/tvschedule/edit', {
      tvschedule: tvschedule,
      errorMessage: 'Error updating TVSchedule. Try again!',
      pageTitle: 'Update TVSchedule',
    });
  }
});

exports.newClass = catchAsync(async (req, res, next) => {
  res.render('brainstvadmins/classes/new', { eclass: new ClassName(), pageTitle: 'New Class' });
});

exports.createClass = catchAsync(async (req, res, next) => {
  const eclass = new ClassName({
    className: req.body.className,
  });

  try {
    const newClass = await eclass.save();
    res.redirect(`/brainstvadmins/classes`);
  } catch {
    res.render('brainstvadmins/classes/new', {
      eclass: eclass,
      errorMessage: 'Error creating class or class already exist!',
      pageTitle: 'Create class',
    });
  }
});

exports.getFaqs = catchAsync(async (req, res, next) => {
  // Only admin users can view this route
  let searchOptions = {};
  if (req.query.question != null && req.query.question !== '') {
    searchOptions.question = new RegExp(req.query.question, 'i');
  }
  try {
    const faq = await Faq.find(searchOptions);
    res.render('brainstvadmins/faqs/index', {
      faq: faq,
      searchOptions: req.query,
      pageTitle: 'Show faqs',
    });
  } catch {
    res.redirect('brainstvadmins');
  }
});

exports.newFaqs = catchAsync(async (req, res, next) => {
  res.render('brainstvadmins/faqs/new', { faq: new Faq(), pageTitle: 'New faq' });
});

exports.createFaqs = catchAsync(async (req, res, next) => {
  const faq = new Faq({
    question: req.body.question,
    answer: req.body.answer,
  });

  try {
    const newFaq = await faq.save();
    res.redirect(`/brainstvadmins/faqs`);
  } catch {
    res.render('brainstvadmins/faqs/new', {
      faq: faq,
      errorMessage: 'Error creating FAQs or FAQs already exist!',
      pageTitle: 'Create faq',
    });
  }
});

exports.editAdminUser = catchAsync(async (req, res, next) => {
  try {
    const admin = await ClubMember.findById(req.params.id);
    res.render('brainstvadmins/edit', {
      admin: admin,
      pageTitle: 'Edit admin user',
    });
  } catch {
    res.redirect('/brainstivadmins/viewAdmin');
  }
});

exports.editClass = catchAsync(async (req, res, next) => {
  try {
    const eclass = await ClassName.findById(req.params.id);
    res.render('brainstvadmins/classes/edit', {
      eclass: eclass,
      pageTitle: 'Edit class',
    });
  } catch {
    res.redirect('/brainstivadmins/viewAdmin');
  }
});

exports.editFaqs = catchAsync(async (req, res, next) => {
  try {
    const faq = await Faq.findById(req.params.id);
    res.render('brainstvadmins/faqs/edit', {
      faq: faq,
      pageTitle: 'Edit faq',
    });
  } catch {
    res.redirect('/brainstivadmins/faqs');
  }
});

exports.updateAdminUser = catchAsync(async (req, res, next) => {
  let admin;

  try {
    admin = await ClubMember.findByIdAndUpdate(req.params.id);
    admin.firstname = req.body.firstname;
    admin.lastname = req.body.lastname;
    admin.email = req.body.email;
    admin.role = req.body.role;
    admin.dob = req.body.dob;
    admin.phone = req.body.phone;
    admin.city = req.body.city;
    admin.gender = req.body.gender;
    admin.signedConsent = req.body.signedConsent;

    // if (req.body.password === '' && admin.password != null) {
    //   admin.password = admin.password;
    // } else {
    //   admin.password = req.body.password;
    // }

    await admin.save({ validateBeforeSave: false });

    //res.redirect(`/brainstvadmins/${admin.id}`);
    res.redirect('/brainstvadmins/viewAdmin');
  } catch (error) {
    console.log(error);
    if (admin == null) {
      res.redirect('/brainstvadmins/viewAdmin');
    } else {
      res.render('brainstvadmins/edit', {
        admin: admin,
        errorMessage: 'Error updating admin member. Try again!',
        pageTitle: 'Update admin user',
      });
    }
  }
});

exports.updateClass = catchAsync(async (req, res, next) => {
  let eclass;

  try {
    eclass = await ClassName.findById(req.params.id);
    eclass.className = req.body.className;

    await eclass.save();
    //res.redirect(`/brainstvadmins/${admin.id}`);
    res.redirect('/brainstvadmins/classes');
  } catch {
    res.render('brainstvadmins/classes/edit', {
      eclass: eclass,
      errorMessage: 'Error updating class name. Try again!',
      pageTitle: 'Update class',
    });
  }
});

exports.updateFaqs = catchAsync(async (req, res, next) => {
  let faq;

  try {
    faq = await Faq.findById(req.params.id);
    faq.question = req.body.question;
    faq.answer = req.body.answer;

    await faq.save();
    res.redirect('/brainstvadmins/faqs');
  } catch {
    res.render('brainstvadmins/faqs/edit', {
      faq: faq,
      errorMessage: 'Error updating FAQ. Try again!',
      pageTitle: 'Update faq',
    });
  }
});

exports.deleteAdminUser = catchAsync(async (req, res, next) => {
  let admin;
  try {
    admin = await ClubMember.findById(req.params.id);
    if (admin.role != 'superAdmin') {
      await admin.remove();
    }
    res.redirect('/brainstvadmins/viewAdmin');
  } catch {
    if (admin == null) {
      res.redirect('/brainstvadmins/viewAdmin');
    } else {
      res.redirect('/brainstvadmins/viewAdmin');
    }
  }
});

exports.deleteClass = catchAsync(async (req, res, next) => {
  let eclass;

  try {
    eclass = await ClassName.findById(req.params.id);
    await eclass.remove();
    res.redirect('/brainstvadmins/classes');
  } catch {
    if (eclass == null) {
      res.redirect('/brainstvadmins/viewAdmin');
    } else {
      res.redirect('/brainstvadmins/classes');
    }
  }
});

exports.deleteFaqs = catchAsync(async (req, res, next) => {
  let faq;

  try {
    faq = await Faq.findById(req.params.id);
    await faq.remove();
    res.redirect('/brainstvadmins/faqs');
  } catch {
    if (faq == null) {
      res.redirect('/brainstvadmins/viewAdmin');
    } else {
      res.redirect('/brainstvadmins/faqs');
    }
  }
});

exports.deleteShow = catchAsync(async (req, res, next) => {
  let show;

  try {
    show = await Show.findById(req.params.id);
    await show.remove();
    res.redirect('/brainstvadmins/shows');
  } catch {
    if (show == null) {
      res.redirect('/brainstvadmins/viewAdmin');
    } else {
      res.redirect('/brainstvadmins/shows');
    }
  }
});

exports.deleteTVSchedule = catchAsync(async (req, res, next) => {
  let tvschedule;

  try {
    tvschedule = await Tvschedule.findById(req.params.id);
    await tvschedule.remove();
    res.redirect('/brainstvadmins/tvschedule');
  } catch {
    res.redirect('/brainstvadmins/tvschedule');
  }
});

// Delete to be executed from handlerFactory deleteOne function
// handlerFactory is imported above as factory with require
// exports.deleteShow = factory.deleteOne(Show);
