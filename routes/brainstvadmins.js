const express = require('express');
const router = express.Router();
const Admin = require('../models/brainstvadmin');
const ClassName = require('../models/class');
const Faq = require('../models/faq');

//Admin User Page Route
router.get('/', (req, res) => {
  // Only admin users can view this route

  res.render('brainstvadmins/index');
});

//Classes Page Route
router.get('/classes', async (req, res) => {
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
    });
  } catch {
    res.redirect('brainstvadmins');
  }
});

// FAQs Page Route
router.get('/faqs', async (req, res) => {
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
    });
  } catch {
    res.redirect('brainstvadmins');
  }
});

// View All Admin Users Route
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

//New Class Route
router.get('/classes/new', (req, res) => {
  res.render('brainstvadmins/classes/new', { eclass: new ClassName() });
});

//Create New class
router.post('/classes', async (req, res) => {
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
    });
  }
});

//New FAQs Route
router.get('/faqs/new', (req, res) => {
  res.render('brainstvadmins/faqs/new', { faq: new Faq() });
});

//Create New FAQ
router.post('/faqs', async (req, res) => {
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

// Edit Class by id //
router.get('/classes/:id/edit', async (req, res) => {
  try {
    const eclass = await ClassName.findById(req.params.id);
    res.render('brainstvadmins/classes/edit', {
      eclass: eclass,
    });
  } catch {
    res.redirect('/brainstivadmins/viewAdmin');
  }
});

// Edit Faqs by id //
router.get('/faqs/:id/edit', async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    res.render('brainstvadmins/faqs/edit', {
      faq: faq,
    });
  } catch {
    res.redirect('/brainstivadmins/faqs');
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

// Update Class by id //
router.put('/classes/:id', async (req, res) => {
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
    });
  }
});

// Update Faqs by id //
router.put('/faqs/:id', async (req, res) => {
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
    });
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

// Delete Class by id
router.delete('/classes/:id', async (req, res) => {
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

// Delete FAQs by id
router.delete('/faqs/:id', async (req, res) => {
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

// async function auth(req, res, next) {
//   if (req.query.admin === 'true') {
//     next();
//   } else {
//     res.send('Not Authenticated');
//   }
//   next();
// }

module.exports = router;
