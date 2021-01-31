const express = require('express');
const router = express.Router();
// const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ClubMember = require('../models/clubmember');
const Membercategory = require('../models/category');

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
  let searchOptions = {};
  if (req.query.firstname != null && req.query.firstname !== '') {
    searchOptions.firstname = new RegExp(req.query.firstname, 'i');
  }
  try {
    const clubmembers = await ClubMember.find(searchOptions);
    res.render('clubmembers/viewmembers', {
      clubmembers: clubmembers,
      searchOptions: req.query,
    });
    //res.send('All Clubmembers');
  } catch {
    res.redirect('/');
  }
});

// View Club members by ids
// router.get('/viewmember/:id', async (req, res) => {});
router.get('/viewmemberbyid', async (req, res) => {
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
    // const clubmember = await ClubMember.find({});
    const clubmember = await query.exec();
    const membercategories = await Membercategory.find({});
    res.render('clubmembers/viewmemberbyid', {
      clubmember: clubmember,
      searchOptions: req.query,
      membercategories: membercategories,
    });
    //console.log(searchOptions);
  } catch {
    res.redirect('/');
  }
});

// Delete Club members by id
router.delete('/deletemember/:id', async (req, res) => {});

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
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    gender: req.body.gender,
    class: req.body.class,
    dob: req.body.dob,
    phone: req.body.phone,
    city: req.body.city,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    // profileImageName: fileName,
    signedConsent: req.body.signedConsent,
  });

  saveProfilePhoto(clubmember, req.body.profilePhoto); //profilePhoto is the name attr for input type 'file' in form

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

// function removeClubmemberPhoto(filename) {
//   fs.unlink(path.join(uploadPath, filename), (err) => {
//     if (err) console.error(err);
//   });
// }

async function renderNewMember(res, clubmember, hasError = false) {
  try {
    const membercategories = await Membercategory.find({});
    const params = {
      membercategories: membercategories,
      clubmember: clubmember,
    };

    if (hasError) params.errorMessage = 'An error occurred while processing form. Try again!';
    res.render('clubmembers/newclubmember', params);
  } catch {
    res.redirect('clubmembers/newClubmember', {
      errorMessage: 'There was an error trying to register member.',
    });
  }
}

function saveProfilePhoto(clubmember, profilePhotoEncoded) {
  if (profilePhotoEncoded == null) return;
  const profilePhoto = JSON.parse(profilePhotoEncoded);
  if (profilePhoto != null && imageMimeTypes.includes(profilePhoto.type)) {
    clubmember.profileImage = new Buffer.from(profilePhoto.data, 'base64');
    clubmember.profileImageType = profilePhoto.type;
  }
}

module.exports = router;
