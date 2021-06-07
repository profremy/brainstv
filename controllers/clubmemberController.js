const multer = require('multer');
const sharp = require('sharp');
const ClubMember = require('./../models/clubmember');
const Membercategory = require('../models/category');
const ClassName = require('../models/class');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const saveProfilePhoto = require('../utils/saveProfilePhoto');
const factory = require('./handlerFactory');

// Write file to disk
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/clubmembers');
//   },
//   filename: (req, file, cb) => {
//     // clubmember-74745858bda6bc-16956245785.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `clubmember-${req.clubmember.id}-${Date.now()}.${ext}`);
//   },
// });

// OR Write file to memory
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // use the filter to test if the file is an image. Test for file type here
  if (file.mimetype.startsWith('image')) {
    // pass null or no error to callback with true - its an image
    cb(null, true);
  } else {
    // pass an error message to callback with false - its not an image
    cb(new AppError('Not an image file! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadClubmemberPhoto = upload.single('photo');

exports.resizeClubmemberPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `clubmember-${req.clubmember.id}-${Date.now()}.jpeg`;

  // Do image resizing with the sharp package
  // This creates an object in which we can chain multiple methods eg. resize, toFormat
  await sharp(req.file.buffer).resize(500, 500).withMetadata().toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/clubmembers/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    // If  the allowed fields array include current field name, add the field to newObj
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// const imageMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

exports.getAllClubMembers = catchAsync(async (req, res, next) => {
  let query = ClubMember.find();
  if (req.query.firstname != null && req.query.firstname != '') {
    query = query.regex('firstname', new RegExp(req.query.firstname, 'i'));
  }

  if (req.query.registeredBefore != null && req.query.registeredBefore != '') {
    query = query.lte('dateJoined', req.query.registeredBefore);
  }

  if (req.query.registeredAfter != null && req.query.registeredAfter != '') {
    query = query.gte('dateJoined', req.query.registeredAfter);
  }

  try {
    let clubmembers;
    //const clubmember = await ClubMember.find({}); //
    clubmembers = await query.exec();
    const membercategories = await Membercategory.find({});
    const eclass = await ClassName.find({});
    res.render('clubmembers/viewmembers', {
      clubmembers: clubmembers,
      searchOptions: req.query,
      membercategories: membercategories,
      eclass: eclass,
      pageTitle: 'Club members',
    });
  } catch {
    res.redirect('/');
  }

  // let clubmembers;
  // // const clubmember = await ClubMember.find({}); //
  // clubmembers = await query.exec();
  // const membercategories = await Membercategory.find({});
  // const eclass = await ClassName.find({});

  // res.status(200).json({
  //   status: 'success',
  //   results: clubmembers.length,
  //   data: {
  //     clubmembers: clubmembers,
  //     searchOptions: req.query,
  //     membercategories: membercategories,
  //     eclass: eclass,
  //   },
  // });
});

//exports.getAllUsers = factory.getAll(ClubMember);

exports.newMember = async (req, res) => {
  renderNewMember(res, new ClubMember());
};

exports.getMe = (req, res, next) => {
  req.params.id = req.clubmember.id;
  next();
};

// exports.getUser = factory.getOne(ClubMember);

exports.getUser = async (req, res) => {
  try {
    const clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName }).exec();

    res.render('clubmembers/show', {
      clubmember: clubmember,
      pageTitle: 'Club Member Admin View',
    });
  } catch {
    res.redirect('/clubmembers');
  }
};

exports.showClubMemberProfile = async (req, res) => {
  try {
    const clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory', model: Membercategory }).populate({ path: 'className', model: ClassName }).exec();
    //const clubmember = await ClubMember.findById(req.params.id).populate('memberCategory className').exec();
    res.render('clubmembers/profile/', {
      clubmember: clubmember,
      pageTitle: 'Member profile',
    });
  } catch {
    res.redirect('/');
  }
};

exports.registered = (req, res) => {
  res.render('clubmembers/registered', { pageTitle: 'Registeration Completed' });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('clubmembers/signin/index', { pageTitle: 'Log into your account' });
};

exports.getForgottenForm = (req, res) => {
  res.status(200).render('clubmembers/signin/forgotten', { pageTitle: 'Forgotten Password' });
};

exports.getAccountPasswordResetForm = (req, res) => {
  res.status(200).render('clubmembers/profile/account_password_reset', {
    pageTitle: 'Reset Password',
  });
};

/*
exports.createClubMember = catchAsync(async (req, res, next) => {
  const clubmember = new ClubMember({
    memberCategory: req.body.memberCategory,
    className: req.body.className,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    gender: req.body.gender,
    dob: req.body.dob,
    phone: req.body.phone,
    city: req.body.city,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    // profileImageName: fileName,
    signedConsent: req.body.signedConsent,
  });

  if (req.body.profilePhoto != null && req.body.profilePhoto !== '') {
    saveProfilePhoto(clubmember, req.body.profilePhoto); //profilePhoto is the name attr for input type 'file' in form
  }

  try {
    const newClubmember = await clubmember.save();
    res.redirect('clubmembers/registered');
  } catch {
    renderNewMember(res, clubmember, true);
  }
});
*/

exports.updateClubMember = async (req, res) => {
  let clubmember;

  try {
    clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName }).select('+password').exec();
    clubmember.pointsEarned = req.body.pointsEarned;

    if (req.body.profilePhoto != null && req.body.profilePhoto !== '') {
      saveProfilePhoto(clubmember, req.body.profilePhoto);
    }
    await clubmember.save({ validateBeforeSave: false });
    res.redirect(`/clubmembers/${clubmember.id}`);
  } catch {
    if (clubmember != null) {
      renderEditMember(res, clubmember, true);
    } else {
      redirect('/clubmembers');
    }
  }
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  // 1) Create error if clubmember POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  // So only listed fields are actually allowed to be updated
  const filteredBody = filterObj(req.body, 'firstname', 'lastname', 'email', 'gender', 'phone', 'dob', 'city');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update clubmember document
  const updatedClubmember = await ClubMember.findByIdAndUpdate(req.clubmember.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      clubmember: updatedClubmember,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await ClubMember.findByIdAndUpdate(req.clubmember.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Only for Administrators since findByIdAndUpdate disables safe middleware
// Use updateUser function only for data other than password
// DO NOT USE TO UPDATE PASSWORDS!
exports.updateUser = factory.updateOne(ClubMember);

exports.updateClubMemberProfile = async (req, res) => {
  let clubmember;

  try {
    clubmember = await ClubMember.findByIdAndUpdate(req.params.id).populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName }).select('+password').exec();
    //clubmember.pointsEarned = req.body.pointsEarned;
    //console.log(clubmember);
    clubmember.memberCategory.memberCategory = req.body.memberCategory;
    clubmember.firstname = req.body.firstname;
    clubmember.lastname = req.body.lastname;
    //clubmember.signedConsent = req.body.signedConsent;
    //clubmember.dateJoined = new Date(req.body.dateJoined);
    clubmember.gender = req.body.gender;
    clubmember.dob = new Date(req.body.dob);
    clubmember.className.ClassName = req.body.className;
    clubmember.email = req.body.email;
    clubmember.phone = req.body.phone;
    clubmember.city = req.body.city;

    // if (req.body.password === '' && clubmember.password != null) {
    //   clubmember.password = clubmember.password;
    // } else {
    //   clubmember.password = req.body.password;
    // }

    if (req.body.profilePhoto != null && req.body.profilePhoto !== '') {
      saveProfilePhoto(clubmember, req.body.profilePhoto);
    }
    await clubmember.save({ validateBeforeSave: false });
    res.redirect(`/clubmembers/profile/${clubmember.id}`);
  } catch {
    if (clubmember != null) {
      renderEditMemberProfile(res, clubmember, true);
    } else {
      redirect('/');
    }
  }
};

exports.editClubMember = async (req, res) => {
  try {
    const clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName }).select('+password').exec();
    // const clubmember = await ClubMember.findById(req.params.id).populate('memberCategory className').exec();
    renderEditMember(res, clubmember);
  } catch {
    res.redirect('/clubmembers');
  }
};

exports.editClubMemberProfile = async (req, res) => {
  try {
    const clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName }).select('+password').exec();
    renderEditMemberProfile(res, clubmember);
  } catch {
    res.redirect('/');
  }
};

exports.deleteClubMember = async (req, res) => {
  let clubmember;
  try {
    clubmember = await ClubMember.findById(req.params.id);
    await clubmember.remove();
    res.redirect('/clubmembers');
  } catch {
    if (clubmember != null) {
      res.render('clubmember/show', {
        clubmember: clubmember,
        errorMessage: 'Could not remove clubmember',
      });
    } else {
      res.redirect('/clumbmembers');
    }
  }
};

exports.deleteUser = factory.deleteOne(ClubMember);

async function renderNewMember(res, clubmember, hasError = false) {
  renderFormPage(res, clubmember, 'newclubmember', hasError);
}

async function renderEditMember(res, clubmember, hasError = false) {
  renderFormPage(res, clubmember, 'edit', hasError);
}

async function renderEditMemberProfile(res, clubmember, hasError = false) {
  renderFormProfilePage(res, clubmember, 'edit', hasError);
}

async function renderFormPage(res, clubmember, form, hasError = false) {
  try {
    const membercategories = await Membercategory.find({});
    const params = {
      membercategories: membercategories,
      clubmember: clubmember,
      pageTitle: 'Join Brains Club',
    };
    if (hasError) {
      if (form == 'edit') {
        params.errorMessage = 'An error occurred while updating member. Try again!';
      } else {
        params.errorMessage = 'An error occurred while creating member. Try again!';
      }
    }
    res.render(`clubmembers/${form}`, params);
  } catch {
    res.redirect('/clubmembers');
  }
}

async function renderFormProfilePage(res, clubmember, form, hasError = false) {
  try {
    const membercategories = await Membercategory.find({});
    const params = {
      membercategories: membercategories,
      clubmember: clubmember,
      pageTitle: 'Member profile',
    };
    if (hasError) {
      if (form == 'edit') {
        params.errorMessage = 'An error occurred while updating Profile. Try again!';
      } else {
        params.errorMessage = 'An error occurred while creating Profile. Try again!';
      }
    }
    res.render(`clubmembers/profile/${form}`, params);
  } catch {
    res.redirect('/');
  }
}

// function saveProfilePhoto(clubmember, profilePhotoEncoded) {
//   if (profilePhotoEncoded != null) {
//     const profilePhoto = JSON.parse(profilePhotoEncoded);
//     if (profilePhoto != null && imageMimeTypes.includes(profilePhoto.type)) {
//       clubmember.profileImage = new Buffer.from(profilePhoto.data, 'base64');
//       clubmember.profileImageType = profilePhoto.type;
//     }
//   }
// }
