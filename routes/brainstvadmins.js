const express = require('express');
const router = express.Router();
const Admin = require('../models/brainstvadmin');

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
    res.render('brainstvadmins/viewAdmin', {
      admins: admins,
      searchOptions: req.query,
    });
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
    res.redirect(`/brainstvadmins/viewAdmin`);
  } catch {
    res.render('brainstvadmins/new', {
      admin: admin,
      errorMessage: 'Error creating admin user or admin user already exist!',
    });
  }
});

// Edit Admin by id //
router.get('/:id/edit', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.render('brainstvadmins/edit', {
      admin: admin,
    });
  } catch {
    res.redirect('/brainstivadmins/viewAdmin');
  }
});

// Update Admin by id //
router.put('/:id', async (req, res) => {
  let admin;

  try {
    admin = await Admin.findById(req.params.id);
    admin.userName = req.body.userName;
    admin.userEmail = req.body.userEmail;
    admin.adminRole = req.body.adminRole;

    if (req.body.userPassword === '' && admin.userPassword != null) {
      admin.userPassword = admin.userPassword;
    } else {
      admin.userPassword = req.body.userPassword;
    }

    await admin.save();
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
      });
    }
  }
});

// Delete Admin by id
router.delete('/:id', async (req, res) => {
  let admin;
  try {
    admin = await Admin.findById(req.params.id);
    if (admin.adminRole != 'superAdmin') {
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

// async function auth(req, res, next) {
//   if (req.query.admin === 'true') {
//     next();
//   } else {
//     res.send('Not Authenticated');
//   }
//   next();
// }

module.exports = router;
