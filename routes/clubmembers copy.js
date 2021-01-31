const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ClubMember = require('../models/clubmember');
const Membercategory = require('../models/clubmembercategory');

const uploadPath = path.join('public', ClubMember.profileImageBasePath);
const imageMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

//All Club members Route
router.get('/', async (req, res) => {
  // only admin users can view this router
  try {
    const membercategories = await Membercategory.find({});
    const clubmember = new ClubMember();
    res.render('clubmembers/viewclubmember', {
      membercategories: membercategories,
      clubmember: clubmember,
    });
  } catch {
    res.redirect('clubmembers/viewclubmember', {
      errorMessage: 'There was an error trying to retrieve member(s).',
    });
  }
});

// //Club member search Route
// router.get('/clubmembersearch', (req, res) => {
//   res.render('clubmembers/clubmembersearch');
// });

//New Club member Route
router.get('/newClubMember', async (req, res) => {
  // A function created at the bottom of the page for this purpose
  renderNewMember(res, new ClubMember());
  // try {
  //   const membercategories = await Membercategory.find({});
  //   const clubmember = new ClubMember();
  //   res.render('clubmembers/newclubmember', {
  //     membercategories: membercategories,
  //     clubmember: clubmember,
  //   });
  // } catch {
  //   res.redirect('/newClubmember', {
  //     errorMessage: 'There was an error trying to register member.',
  //   });
  // }
});

//Thank you for Registering page
router.get('/registered', (req, res) => {
  res.render('clubmembers/registered');
});

//Create New User Route
router.post('/', upload.single('profilePhoto'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;

  const clubmember = new ClubMember({
    memberCategory: req.body.mCategory,
    dateJoined: req.body.dateJoined,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    gender: req.body.gender,
    age: req.body.age,
    phone: req.body.phone,
    address: req.body.address,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    profileImage: fileName,
    signedConsent: req.body.signedConsent,
  });

  try {
    const newClubmember = await clubmember.save();
    // res.redirect(`clubmember/${newClubmember.id}`);
    res.redirect('clubmembers/registered');
    //res.redirect('clubmembers/newclubmember');
  } catch {
    // res.render('clubmembers/newclubmember', {
    //   errorMessage: 'There was an error, review all fields highlighted in red and try again.',
    // });

    renderNewMember(res, clubmember, true);
  }
});

async function renderNewMember(res, clubmember, hasError = false) {
  try {
    const membercategories = await Membercategory.find({});
    //const clubmember = new ClubMember();
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

module.exports = router;
