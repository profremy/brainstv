const express = require('express');
const router = express.Router();
// const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ClubMember = require('../models/clubmember');
const Membercategory = require('../models/category');
const ClassName = require('../models/class');

// const uploadPath = path.join('public', ClubMember.profileImageBasePath);
const imageMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

// Club members Route
// router.get('/', async (req, res) => {});

//View All Club members Route
router.get('/', async (req, res) => {
  // only admin users can view this router

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
    // const clubmember = await ClubMember.find({}); //
    clubmembers = await query.exec();
    const membercategories = await Membercategory.find({});
    const eclass = await ClassName.find({});
    res.render('clubmembers/viewmembers', {
      clubmembers: clubmembers,
      searchOptions: req.query,
      membercategories: membercategories,
      eclass: eclass,
    });
  } catch {
    res.redirect('/');
  }
});

//New Club member Route
router.get('/newClubMember', async (req, res) => {
  // A function created at the bottom of the page for this purpose
  renderNewMember(res, new ClubMember());
});

//Thank you for Registering page
router.get('/registered', (req, res) => {
  res.render('clubmembers/registered');
});

//Create New User Route
// router.post('/', upload.single('profilePhoto'), async (req, res) => {
router.post('/', async (req, res) => {
  // const fileName = req.file != null ? req.file.filename : null;

  const clubmember = new ClubMember({
    //dateJoined: req.body.dateJoined,
    memberCategory: req.body.memberCategory,
    className: req.body.className,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    gender: req.body.gender,
    // class: req.body.class,
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
  //saveProfilePhoto(clubmember, req.body.profilePhoto); //profilePhoto is the name attr for input type 'file' in form

  try {
    const newClubmember = await clubmember.save();
    // res.redirect(`clubmembers/${newClubmember.id}`);
    res.redirect('clubmembers/registered');
    //res.redirect(`clubmembers`);
  } catch {
    // if (clubmember.profileImageName != null) {
    //   removeClubmemberPhoto(clubmember.profileImageName);
    // }
    renderNewMember(res, clubmember, true);
  }
});

// Show clubmember by id
router.get('/:id', async (req, res) => {
  try {
    const clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName }).exec();
    //const clubmember = await ClubMember.findById(req.params.id).populate('memberCategory className').exec();
    res.render('clubmembers/show', {
      clubmember: clubmember,
    });
  } catch {
    res.redirect('/clubmembers');
  }
});

// Show clubmember profile by id
router.get('/profile/:id', async (req, res) => {
  try {
    const clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory', model: Membercategory }).populate({ path: 'className', model: ClassName }).exec();
    //const clubmember = await ClubMember.findById(req.params.id).populate('memberCategory className').exec();
    res.render('clubmembers/profile/', {
      clubmember: clubmember,
    });
  } catch {
    res.redirect('/');
  }
});

// Edit clubmember by id
router.get('/:id/edit', async (req, res) => {
  try {
    const clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName }).exec();
    // const clubmember = await ClubMember.findById(req.params.id).populate('memberCategory className').exec();
    renderEditMember(res, clubmember);
  } catch {
    res.redirect('/clubmembers');
  }
});

// Edit clubmember profile by id
router.get('/profile/:id/edit', async (req, res) => {
  try {
    const clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName }).exec();
    // const clubmember = await ClubMember.findById(req.params.id).populate('memberCategory className').exec();
    renderEditMemberProfile(res, clubmember);
  } catch {
    res.redirect('/');
  }
});

// Update Club member by id
router.put('/:id', async (req, res) => {
  let clubmember;

  try {
    clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName }).exec();
    clubmember.pointsEarned = req.body.pointsEarned;
    // clubmember.memberCategory = req.body.memberCategory;
    // clubmember.firstname = req.body.firstname;
    // clubmember.firstname = req.body.firstname;
    // clubmember.lastname = req.body.lastname;
    // clubmember.dateJoined = new Date(req.body.dateJoined);
    // clubmember.gender = req.body.gender;
    // clubmember.dob = new Date(req.body.dob);
    // clubmember.class = req.body.class;
    // clubmember.email = req.body.email;
    // clubmember.phone = req.body.phone;
    // clubmember.city = req.body.city;
    if (req.body.profilePhoto != null && req.body.profilePhoto !== '') {
      saveProfilePhoto(clubmember, req.body.profilePhoto);
    }
    await clubmember.save();
    res.redirect(`/clubmembers/${clubmember.id}`);
  } catch {
    if (clubmember != null) {
      renderEditMember(res, clubmember, true);
    } else {
      redirect('/clubmembers');
    }
  }
});

// Update Clubmember Profile by id
router.put('/profile/:id', async (req, res) => {
  let clubmember;

  try {
    clubmember = await ClubMember.findById(req.params.id).populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName }).exec();
    //clubmember.pointsEarned = req.body.pointsEarned;
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

    if (req.body.password === '' && clubmember.password != null) {
      clubmember.password = clubmember.password;
    } else {
      clubmember.password = req.body.password;
    }

    if (req.body.profilePhoto != null && req.body.profilePhoto !== '') {
      saveProfilePhoto(clubmember, req.body.profilePhoto);
    }
    await clubmember.save();
    res.redirect(`/clubmembers/profile/${clubmember.id}`);
  } catch {
    if (clubmember != null) {
      renderEditMemberProfile(res, clubmember, true);
    } else {
      redirect('/');
    }
  }
});

// Delete clubmember by id
router.delete('/:id', async (req, res) => {
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
});

// function removeClubmemberPhoto(filename) {
//   fs.unlink(path.join(uploadPath, filename), (err) => {
//     if (err) console.error(err);
//   });
// }

async function renderNewMember(res, clubmember, hasError = false) {
  // try {
  //   const membercategories = await Membercategory.find({});
  //   const params = {
  //     membercategories: membercategories,
  //     clubmember: clubmember,
  //   };

  //   if (hasError) params.errorMessage = 'An error occurred while processing form. Try again!';
  //   res.render('clubmembers/newclubmember', params);
  // } catch {
  //   res.redirect('clubmembers/newClubmember', {
  //     errorMessage: 'There was an error trying to register member.',
  //   });
  // }
  renderFormPage(res, clubmember, 'newclubmember', hasError);
}

async function renderEditMember(res, clubmember, hasError = false) {
  // try {
  //   const membercategories = await Membercategory.find({});
  //   const params = {
  //     membercategories: membercategories,
  //     clubmember: clubmember,
  //   };

  //   if (hasError) params.errorMessage = 'An error occurred while processing form. Try again!';
  //   res.render('clubmembers/edit', params);
  // } catch {
  //   res.redirect('clubmembers/edit', {
  //     errorMessage: 'There was an error trying to update member.',
  //   });
  // }
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
    res.redirect('/clubmembers', {
      errorMessage: 'There was an error trying to create/update member.',
    });
  }
}

async function renderFormProfilePage(res, clubmember, form, hasError = false) {
  try {
    const membercategories = await Membercategory.find({});
    const params = {
      membercategories: membercategories,
      clubmember: clubmember,
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
//   if (profilePhotoEncoded == null) return;
//   const profilePhoto = JSON.parse(profilePhotoEncoded);
//   if (profilePhoto != null && imageMimeTypes.includes(profilePhoto.type)) {
//     clubmember.profileImage = new Buffer.from(profilePhoto.data, 'base64');
//     clubmember.profileImageType = profilePhoto.type;
//   }
// }
function saveProfilePhoto(clubmember, profilePhotoEncoded) {
  if (profilePhotoEncoded != null) {
    const profilePhoto = JSON.parse(profilePhotoEncoded);
    if (profilePhoto != null && imageMimeTypes.includes(profilePhoto.type)) {
      clubmember.profileImage = new Buffer.from(profilePhoto.data, 'base64');
      clubmember.profileImageType = profilePhoto.type;
    }
  }
}

module.exports = router;
