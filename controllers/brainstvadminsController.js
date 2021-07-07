const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const fsPromises = require('fs').promises;
const sharp = require('sharp');
const Admin = require('../models/brainstvadmin');
const ClubMember = require('../models/clubmember');
const ClassName = require('../models/class');
const Tvschedule = require('../models/tvschedule');
const Faq = require('../models/faq');
const Show = require('../models/show');
const Review = require('../models/reviewModel');
const Message = require('../models/discussionModel');
const Livestream = require('../models/livestream');
const Birthday = require('../models/birthday');
const Schoolday = require('../models/schoolDayModel');
const MostAdmired = require('../models/mumAndDadModel');
const Whencanyoustop = require('../models/whenCanYouStop');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const imageMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

const factory = require('./handlerFactory');

const dotenv = require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
// const aws = require('aws-sdk');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY;
const secretAccessKey = process.env.AWS_BUCKET_SECRET_KEY;

const s3 = new S3({ region, accessKeyId, secretAccessKey });
// const s3 = new aws.S3({ region, accessKeyId, secretAccessKey });

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      //console.log(file);
      let ext = '';
      if (file) {
        ext = file.originalname.split('.')[1];
      }

      if (file.mimetype.startsWith('image')) ext = 'jpeg';

      cb(null, `${req.body.showTitle.split(' ').join('_').toLowerCase()}.${ext}`);
    },
  }),
});

function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'views/brainstv');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.originalname}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // use the filter to test if the file is an image. Test for file type here

  // if (file.originalname.split('.')[1] === 'ejs') {
  //   // pass null or no error to callback with true - its a .ejs file
  //   cb(null, true);
  // } else {
  //   // pass an error message to callback with false - its not an image
  //   cb(new AppError('This file is not allowed! Please upload only .ejs file', 400), false);
  // }

  // // use the filter to test if the file is an image. Test for file type here
  // if (file.mimetype.startsWith('image')) {
  //   // pass null or no error to callback with true - its an image
  //   cb(null, true);
  // } else {
  //   // pass an error message to callback with false - its not an image
  //   cb(new AppError('Not an image file! Please upload only images.', 400), false);
  // }

  // use the filter to test if the file is an image. Test for file type here
  if (file.mimetype.startsWith('image')) {
    // pass null or no error to callback with true - its an image
    cb(null, true);
  } else if (file.originalname.split('.')[1] === 'ejs') {
    // pass null or no error to callback with true - its a .ejs file
    cb(null, true);
  } else if (file.originalname.split('.')[1] === 'pdf') {
    cb(null, true);
  } else {
    // pass an error message to callback with false - its not an image
    cb(new AppError('Not an image .pdf, or .ejs file! Please upload only relevant files.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadAppFile = upload.single('selectedFile');
// exports.uploadShowThumbnail = upload.single('showThumbnail');

/*
exports.uploadBirthdayCard = upload.single('birthdayCard');

exports.birthdayCardUploadHandler = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Not an image or no file attached! Please upload only images.', 400), false);
  }

  console.log(req.file);

  // use the filter to test if the file is an image. Test for file type here
  const bufferData = req.file.buffer;
  req.body.birthdayCard = `${bufferData}`;

  return next();
});
*/

// Multiple field names with multiple files (maxCount: 3) or single file (maxCount: 1) of any mime type
exports.uploadShowResourceFiles = uploadS3.fields([
  { name: 'showThumbnail', maxCount: 1 },
  { name: 'downloadableDocument', maxCount: 1 },
]);

// Single field name with multiple files of any mime type
//exports.attachFiles = upload.array('fileAttachements', 3); // image audio video file: Form field => name="fileAttachments"

exports.renderAdminPanel = catchAsync(async (req, res, next) => {
  res.status(200).render('brainstvadmins', { pageTitle: 'Admin Panel', successMessage: 'File Successfully Uploaded!' });
});

exports.fileUploadHandler = catchAsync(async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  //console.log(req.files);

  // use the filter to test if the file is an image and a pdf here
  if (req.files.showThumbnail && req.files.downloadableDocument) {
    req.body.showThumbnail = `${req.files.showThumbnail[0].key}`;
    // req.body.showThumbnail = `${req.body.showTitle.split(' ').join('_').toLowerCase()}.jpeg`;
    // await sharp(req.files.showThumbnail[0].buffer).resize(500, 500).withMetadata().toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/show_images/${req.body.showThumbnail}`);

    req.body.downloadableDocument = `${req.files.downloadableDocument[0].key}`;
    // req.body.downloadableDocument = `${req.body.showTitle.split(' ').join('_').toLowerCase()}.pdf`;
    // await fsPromises.writeFile(`views/brainstv/downloadables/${req.body.downloadableDocument}`, req.files.downloadableDocument[0].buffer);

    return next();
  }

  // use the filter to test if the file is an image. Test for file type here
  if (req.files.showThumbnail) {
    //* req.body.showThumbnail = `${req.body.showTitle.split(' ').join('_').toLowerCase()}.jpeg`;
    req.body.showThumbnail = `${req.files.showThumbnail[0].key}`;
    //console.log(req.files.showThumbnail[0].key);

    // Do image resizing with the sharp package
    // This creates an object in which we can chain multiple methods eg. resize, toFormat
    //*await sharp(req.files.showThumbnail[0].buffer).resize(500, 500).withMetadata().toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/show_images/${req.body.showThumbnail}`);

    return next();
  }

  /*

  // Processing array of multiple file attachments
  // Assumes all files are images so converts to .jpeg
  req.body.fileAttachments = [];
  await Promise.all(
    req.files.fileAttachments.map(async (file, index) => {
      //const ext =  req.files.originalname.split('.')[1];
      const filename = `${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
      await sharp(file.buffer).resize(2000, 1333).withMetadata().toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/show_images/${filename}`);
      req.body.fileAttachments.push(filename);
    })
  );
  */

  //next();
});

exports.updateSlug = catchAsync(async (req, res, next) => {
  req.body.slug = `${req.body.showTitle.split(' ').join('-').toLowerCase()}`;
  next();
});
/*
exports.fileUploadHandlerEdit = catchAsync(async (req, res, next) => {
  console.log(req.files);
  // if (!req.files.showThumbnail || !req.files.downloadableDocument) {
  if (!req.files) {
    console.log('No  F I L E');
    return next();
  }

  console.log('File or Files exist - Processing...');

  // use the filter to test if the file is an image. Test for file type here
  if (req.files.showThumbnail[0].mimetype.startsWith('image')) {
    console.log('process image file');
    req.body.showThumbnail = `${req.body.showTitle.split(' ').join('_').toLowerCase()}.jpeg`;

    // Do image resizing with the sharp package
    // This creates an object in which we can chain multiple methods eg. resize, toFormat
    await sharp(req.files.showThumbnail[0].buffer).resize(500, 500).withMetadata().toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/show_images/${req.body.showThumbnail}`);
  } else if (req.files.showThumbnail[0].mimetype.startsWith('image') && req.files.downloadableDocument[0].originalname.split('.')[1] === 'pdf') {
    console.log('process image and pdf file');

    req.body.showThumbnail = `${req.body.showTitle.split(' ').join('_').toLowerCase()}.jpeg`;
    await sharp(req.files.showThumbnail[0].buffer).resize(500, 500).withMetadata().toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/show_images/${req.body.showThumbnail}`);

    req.body.downloadableDocument = `${req.body.showTitle.split(' ').join('_').toLowerCase()}.pdf`;
    await fsPromises.writeFile(`views/brainstv/downloadables/${req.body.downloadableDocument}`, req.files.downloadableDocument[0].buffer);
  }

  next();
});
*/
exports.uploadAppFileHandler = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Not a .ejs. .pdf or no file attached!.', 400), false);
  }

  if (req.file.originalname.split('.')[1] === 'ejs' || req.file.originalname.split('.')[1] === 'pdf') {
    req.file.filename = `${req.file.originalname}`;
    await fsPromises.writeFile(`views/brainstv/${req.file.filename}`, req.file.buffer);
  }
  next();
});

exports.downloadPrivacyPolicy = catchAsync(async (req, res, next) => {
  try {
    const filePath = 'views/brainstv/privacy-policy.ejs'; // The path to the file
    const fileName = 'privacy-policy.ejs'; // The default name the browser will use

    res.download(filePath, fileName);
  } catch {
    res.redirect('/brainstvadmins');
  }
});
exports.downloadTerms = catchAsync(async (req, res, next) => {
  try {
    const filePath = 'views/brainstv/our-terms.ejs'; // The path to the file
    const fileName = 'our-terms.ejs'; // The default name the browser will use

    res.download(filePath, fileName);
  } catch {
    res.redirect('/brainstvadmins');
  }
});

exports.downloadAdvertPricing = catchAsync(async (req, res, next) => {
  const filePath = 'views/brainstv/advertising-price-list.pdf'; // The path to the file
  const fileName = 'advertising-price-list.pdf'; // The default name the browser will use

  res.download(filePath, fileName);
});

exports.getUploadFile = catchAsync(async (req, res, next) => {
  try {
    res.status(200).render('brainstvadmins/uploadfile', { pageTitle: 'Upload App File' });
  } catch {
    res.redirect('/brainstvadmins');
  }
});

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

exports.getBirthdays = catchAsync(async (req, res, next) => {
  let birthday;
  try {
    birthday = await Birthday.find({});
    res.render('brainstvadmins/birthdays', {
      birthday: birthday,
      pageTitle: 'All Birthday',
    });
  } catch {
    res.redirect('brainstvadmins');
  }
});

exports.newBirthday = catchAsync(async (req, res, next) => {
  //res.render('brainstvadmins/birthdays/new', { birthday: new Birthday(), pageTitle: 'New Birthday' });

  try {
    const birthday = await Birthday.find({});
    if (birthday.length === null || birthday.length < 10) {
      renderNewBirthday(res, new Birthday());
    } else {
      res.render('brainstvadmins/birthdays/index', { birthday: birthday, errorMessage: 'An error occurred. Maximum recordable is 10 Birthdays!', pageTitle: 'New Birthday' });
    }
  } catch {
    res.redirect('/brainstvadmins');
  }
});

exports.createBirthday = catchAsync(async (req, res, next) => {
  const birthday = new Birthday({
    fullName: req.body.fullName,
    birthdayMessage: req.body.birthdayMessage,
    birthdayCard: req.body.birthdayCard,
    birthdayCardType: req.body.birthdayCardType,
  });

  saveBirthdayCard(birthday, req.body.birthdayCard);
  try {
    const newBirthday = await birthday.save();
    res.redirect('/brainstvadmins/birthdays');
  } catch {
    renderNewBirthday(res, birthday, true);
  }
});

exports.editBirthday = catchAsync(async (req, res, next) => {
  try {
    const birthday = await Birthday.findById(req.params.id);
    renderEditBirthday(res, birthday);
  } catch {
    res.redirect('/brainstvadmins');
  }
});

exports.updateBirthday = catchAsync(async (req, res, next) => {
  try {
    birthday = await Birthday.findById(req.params.id);
    birthday.fullName = req.body.fullName;
    birthday.birthdayMessage = req.body.birthdayMessage;
    birthday.birthdayCard = req.body.birthdayCard;
    birthday.birthdayCardType = req.body.birthdayCardType;

    if (req.body.birthdayCard != null && req.body.birthdayCard !== '') {
      saveBirthdayCard(birthday, req.body.birthdayCard);
    }
    await birthday.save();

    res.redirect(`/brainstvadmins/birthdays`);
  } catch (err) {
    //console.log(err);
    if (birthday != null) {
      renderEditBirthday(res, birthday, true);
    } else {
      res.redirect('/brainstvadmins/birthdays');
    }
  }
});

exports.getLivestream = catchAsync(async (req, res, next) => {
  let livestream;
  try {
    livestream = await Livestream.find({}).populate({ path: 'className', model: ClassName }).exec();
    const eclass = await ClassName.find({});
    res.render('brainstvadmins/livestream/index', {
      livestream: livestream,
      eclass: eclass,
      pageTitle: 'Live Stream',
    });
  } catch {
    res.redirect('brainstvadmins');
  }
});

exports.newLivestream = catchAsync(async (req, res, next) => {
  res.render('brainstvadmins/livestream/new', { livestream: new Livestream(), pageTitle: 'New Livestream' });
});

exports.createLivestream = catchAsync(async (req, res, next) => {
  const livestream = new Livestream({
    livestreamURL: req.body.livestreamURL,
    className: req.body.className,
  });

  try {
    const newLivestream = await livestream.save();
    res.redirect(`/brainstvadmins/livestream`);
  } catch {
    res.render('brainstvadmins/livestream/new', {
      livestream: livestream,
      errorMessage: 'Error creating live stream URL or live stream URL already exist!',
      pageTitle: 'Create Live Stream',
    });
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
    //console.log(err);
    res.redirect('brainstvadmins');
  }
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let searchOptions = {};
  if (req.query.review != null && req.query.review !== '') {
    searchOptions.review = new RegExp(req.query.review, 'i');
  }
  try {
    const review = await Review.find(searchOptions).populate({ path: 'show', select: 'showTitle' });
    res.render('brainstvadmins/reviews', {
      review,
      searchOptions: req.query,
      pageTitle: 'All Reviews',
    });
  } catch (error) {
    res.redirect('/brainstvadmins');
  }
});

exports.getAllDiscussions = catchAsync(async (req, res, next) => {
  let searchOptions = {};
  if (req.query.message != null && req.query.message !== '') {
    searchOptions.message = new RegExp(req.query.message, 'i');
  }
  try {
    const message = await Message.find(searchOptions);
    res.render('brainstvadmins/discussions', {
      message,
      searchOptions: req.query,
      pageTitle: 'All Discussions',
    });
  } catch (err) {
    res.redirect('/brainstvadmins');
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
    res.redirect('/brainstvadmins');
  }
});

exports.newShow = catchAsync(async (req, res, next) => {
  try {
    res.render('brainstvadmins/shows/new', { show: new Show(), pageTitle: 'New show' });
  } catch (error) {
    //console.log(error);
    res.redirect('/brainstvadmins');
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
    takePartType: req.body.takePartType,
    showId: req.body.showId,
    className: req.body.className,
    showThumbnail: req.body.showThumbnail,
    downloadableDocument: req.body.downloadableDocument,
    introParagraph: req.body.introParagraph,
    bodyParagraph1: req.body.bodyParagraph1,
    bodyParagraph2: req.body.bodyParagraph2,
    bodyParagraph3: req.body.bodyParagraph3,
    bodyParagraph4: req.body.bodyParagraph4,
    bodyParagraph5: req.body.bodyParagraph5,
    bodyParagraph6: req.body.bodyParagraph6,
    bodyParagraph7: req.body.bodyParagraph7,
    bodyParagraph8: req.body.bodyParagraph8,
    bodyParagraph9: req.body.bodyParagraph9,
    bodyParagraph10: req.body.bodyParagraph10,
    activityList1: req.body.activityList1,
    activityList2: req.body.activityList2,
    activityList3: req.body.activityList3,
    activityList4: req.body.activityList4,
    activityList5: req.body.activityList5,
    activityList6: req.body.activityList6,
    activityList7: req.body.activityList7,
    activityList8: req.body.activityList8,
    activityList9: req.body.activityList9,
    activityList10: req.body.activityList10,
    activityList11: req.body.activityList11,
    activityList12: req.body.activityList12,
    ageGroup: req.body.ageGroup,
    footNote: req.body.footNote,
  });

  try {
    const newShow = await show.save();
    res.redirect('/brainstvadmins/shows');
  } catch {
    res.redirect('/brainstvadmins/shows/new');
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
    show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // show = await Show.findById(req.params.id);
    res.redirect('/brainstvadmins/shows');
    // show.showTitle = req.body.showTitle;
    // show.showType = req.body.showType;
    // show.showId = req.body.showId;
    // show.className.className = req.body.className;
    // show.introParagraph = req.body.introParagraph;
    // show.bodyParagraph1 = req.body.bodyParagraph1;
    // show.bodyParagraph2 = req.body.bodyParagraph2;
    // show.bodyParagraph3 = req.body.bodyParagraph3;
    // show.bodyParagraph4 = req.body.bodyParagraph4;
    // show.bodyParagraph5 = req.body.bodyParagraph5;
    // show.bodyParagraph6 = req.body.bodyParagraph6;
    // show.bodyParagraph7 = req.body.bodyParagraph7;
    // show.bodyParagraph8 = req.body.bodyParagraph8;
    // show.bodyParagraph9 = req.body.bodyParagraph9;
    // show.bodyParagraph10 = req.body.bodyParagraph10;
    // show.activityList1 = req.body.activityList1;
    // show.activityList2 = req.body.activityList2;
    // show.activityList3 = req.body.activityList3;
    // show.activityList4 = req.body.activityList4;
    // show.activityList5 = req.body.activityList5;
    // show.activityList6 = req.body.activityList6;
    // show.activityList7 = req.body.activityList7;
    // show.activityList8 = req.body.activityList8;
    // show.activityList9 = req.body.activityList9;
    // show.activityList10 = req.body.activityList10;
    // show.activityList11 = req.body.activityList11;
    // show.activityList12 = req.body.activityList12;
    // show.ageGroup = req.body.ageGroup;
    // show.footNote = req.body.footNote;

    // if (req.file) show.showThumbnail = req.file.filename;

    // const newshow = await show.save();
    // res.redirect('/brainstvadmins/shows');

    // if (name != '') {
    //   show.showThumbnail = name;
    //   console.log(name);
    //   await show.save();
    //   res.redirect('/brainstvadmins/shows');
    // } else {
    //   show.showThumbnail = show.showThumbnail;
    //   await show.save();
    //   res.redirect('/brainstvadmins/shows');
    // }
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
    const tvschedule = await Tvschedule.find(searchOptions); //.sort({ createdAt: -1 });
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
    showingDate: new Date(req.body.showingDate),
    showingTime: req.body.showingTime,
    showingName: req.body.showingName,
    showPageLink: req.body.showPageLink,
    // showingStatus: req.body.showingStatus,
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
    tvschedule.showingDate = new Date(req.body.showingDate);
    tvschedule.showingTime = req.body.showingTime;
    tvschedule.showingName = req.body.showingName;
    tvschedule.showPageLink = req.body.showPageLink;
    // tvschedule.showingStatus = req.body.showingStatus;

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

exports.editLivestream = catchAsync(async (req, res, next) => {
  try {
    const livestream = await Livestream.findById(req.params.id).populate({ path: 'className', model: ClassName }).exec();
    res.render('brainstvadmins/livestream/edit', {
      livestream: livestream,
      className: req.body.className,
      pageTitle: 'Edit Live Stream',
    });
  } catch {
    res.redirect('/brainstivadmins/livestream');
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
    //console.log(error);
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

exports.updateLivestream = catchAsync(async (req, res, next) => {
  let livestream;

  try {
    livestream = await Livestream.findById(req.params.id).populate({ path: 'className', model: ClassName }).exec();
    livestream.livestreamURL = req.body.livestreamURL;
    livestream.className = req.body.className;
    await livestream.save();
    res.redirect('/brainstvadmins/livestream');
  } catch {
    res.render('brainstvadmins/livestream/edit', {
      livestream: livestream,
      errorMessage: 'Error updating live stream URL ID. Try again!',
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

exports.deleteLivestream = catchAsync(async (req, res, next) => {
  let livestream;

  try {
    livestream = await Livestream.findById(req.params.id);
    await livestream.remove();
    res.redirect('/brainstvadmins/livestream');
  } catch {
    res.redirect('/brainstvadmins');
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

exports.deleteBirthday = catchAsync(async (req, res, next) => {
  let birthday;

  try {
    birthday = await Birthday.findById(req.params.id);
    await birthday.remove();
    res.redirect('/brainstvadmins/birthdays');
  } catch {
    res.redirect('/brainstvadmins/birthdays');
  }
});

exports.getFavoritePartOfSchool = catchAsync(async (req, res, next) => {
  try {
    const schoolday = await Schoolday.find({});
    res.status(200).render('brainstvadmins/favoritePartOfSchool/index', {
      schoolday,
      pageTitle: 'Favorite Part Of School Day Votes',
    });
  } catch {
    res.redirect('/brainstvadmins');
  }
});

exports.deleteFavoritePartOfSchoolById = catchAsync(async (req, res, next) => {
  try {
    const deleteVote = await Schoolday.findById(req.params.id);
    await deleteVote.remove();
    res.redirect('/brainstvadmins/favoritePartOfSchool');
  } catch {
    res.redirect('/brainstvadmins');
  }
});

exports.getMumAndDadVote = catchAsync(async (req, res, next) => {
  try {
    const mostAdmired = await MostAdmired.find({});
    res.status(200).render('brainstvadmins/mumAndDad/index', {
      mostAdmired,
      pageTitle: 'Most Admired Votes',
    });
  } catch {
    res.redirect('/brainstvadmins');
  }
});

exports.deleteMumAndDadVoteById = catchAsync(async (req, res, next) => {
  try {
    const deleteVote = await MostAdmired.findById(req.params.id);
    await deleteVote.remove();
    res.redirect('/brainstvadmins/mumAndDad');
  } catch {
    res.redirect('/brainstvadmins');
  }
});

exports.getWhenCanYouStopVote = catchAsync(async (req, res, next) => {
  try {
    const whencanyoustop = await Whencanyoustop.find({});
    res.status(200).render('brainstvadmins/whenCanYouStop/index', {
      whencanyoustop,
      pageTitle: 'Most Admired Votes',
    });
  } catch {
    res.redirect('/brainstvadmins');
  }
});

exports.deleteWhenCanYouStopVoteById = catchAsync(async (req, res, next) => {
  try {
    const deleteVote = await Whencanyoustop.findById(req.params.id);
    await deleteVote.remove();
    res.redirect('/brainstvadmins/whenCanYouStop');
  } catch {
    res.redirect('/brainstvadmins');
  }
});

exports.deleteMemberReview = catchAsync(async (req, res, next) => {
  try {
    const deleteReview = await Review.findById(req.params.id);
    await deleteReview.remove();
    res.redirect('/brainstvadmins/reviews');
  } catch (error) {
    res.redirect('/brainstvadmins');
  }
});

exports.deleteMemberDiscussion = catchAsync(async (req, res, next) => {
  try {
    const deleteDiscussion = await Message.findById(req.params.id);
    await deleteDiscussion.remove();
    res.redirect('/brainstvadmins/discussions');
  } catch (error) {
    res.redirect('/brainstvadmins');
  }
});

// Delete to be executed from handlerFactory deleteOne function
// handlerFactory is imported above as factory with require
// exports.deleteShow = factory.deleteOne(Show);

async function renderNewBirthday(res, birthday, hasError = false) {
  try {
    const params = {
      birthday: birthday,
      pageTitle: 'New Birthday',
    };

    if (hasError) params.errorMessage = 'An error occurred while processing birthday. Try again!';
    res.render('brainstvadmins/birthdays/new', params);
  } catch {
    res.redirect('/brainstvadmins/birthdays/index');
  }
}

async function renderEditBirthday(res, birthday, hasError = false) {
  try {
    const params = {
      birthday: birthday,
      pageTitle: 'Edit Birthday',
    };

    if (hasError) params.errorMessage = 'An error occurred while processing birthday. Try again!';
    res.render('brainstvadmins/birthdays/edit', params);
  } catch {
    res.redirect('/brainstvadmins/birthdays/edit', {
      errorMessage: 'There was an error trying to update birthday!.',
    });
  }
}

function saveBirthdayCard(birthday, birthdayCardImageEncoded) {
  if (birthdayCardImageEncoded == null) return;
  const birthdayCardImage = JSON.parse(birthdayCardImageEncoded);
  if (birthdayCardImage != null && imageMimeTypes.includes(birthdayCardImage.type)) {
    birthday.birthdayCard = new Buffer.from(birthdayCardImage.data, 'base64');
    birthday.birthdayCardType = birthdayCardImage.type;
  }
}
