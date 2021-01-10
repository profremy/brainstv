const express = require('express');
const router = express.Router();
const Admin = require('../models/brainstvadmin');
const SiteLogo = require('../models/brainstvlogo');

//Admin User Page Route
router.get('/', (req, res) => {
  // Only admin users can view this route

  res.render('brainstvadmins/index');
});

//View All Admin Users Route
router.get('/viewAdmin', async (req, res) => {
  let searchOptions = {};
  if (req.query.userName != null && req.query.userName !== '') {
    searchOptions.userName = new RegExp(req.query.userName, 'i');
  }
  try {
    // const admins = await Admin.find({ $text: { $search: searchOptions.userName } });
    const admins = await Admin.find(searchOptions);
    res.render('brainstvadmins/viewAdmin', { admins: admins, searchOptions: req.query });
  } catch (err) {
    console.log(err);
    res.redirect('brainstvadmins');
  }
});

//New Admin User Route
router.get('/new', (req, res) => {
  res.render('brainstvadmins/new', { admin: new Admin() });
});

//Create Admin User Route
router.post('/', async (req, res) => {
  const admin = new Admin({
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    adminRole: req.body.adminRole,
    userPassword: req.body.userPassword,
  });

  try {
    const newAdmin = await admin.save();
    // res.redirect(`brainstvadmin/${newAdminUser.id}`);
    res.redirect('brainstvadmins');
    // { successMessage: `Admin user with role ${req.body.adminRole} was create.` };
  } catch {
    res.render('brainstvadmins/new', {
      admin: admin,
      errorMessage: 'Error creating Admin User',
    });
  }
});

//New Site Logo Route
router.get('/uploadsitelogo', (req, res) => {
  res.render('brainstvadmins/uploadsitelogo', { logo: new SiteLogo() });
});

// Upload site logo
router.post('/', async (req, res) => {
  const logo = new SiteLogo({
    siteLogoImage: req.body.siteLogoImage,
  });

  try {
    const newSiteLogo = await logo.save();
    // res.redirect(`brainstvadmin/${newAdminUser.id}`);
    res.redirect('brainstvadmins');
    // { successMessage: `Admin user with role ${req.body.adminRole} was create.` };
  } catch {
    res.render('brainstvadmins/uploadsitelogo', {
      admin: admin,
      errorMessage: 'Error uploading site logo image',
    });
  }
});

module.exports = router;
