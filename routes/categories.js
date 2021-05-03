const express = require('express');
const router = express.Router();
const Membercategory = require('../models/category');
const ClubMember = require('../models/clubmember');
const ClassName = require('../models/class');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const authController = require('../controllers/authController');

router.use(authController.isLoggedIn, authController.protect);

//All Users Route
router.get('/', authController.restrictTo('superAdmin', 'basicAdmin'), async (req, res) => {
  // Only admin can access this route
  let searchOptions = {};
  if (req.query.memberCategory != null && req.query.memberCategory !== '') {
    searchOptions.memberCategory = new RegExp(req.query.memberCategory, 'i');
  }
  try {
    const membercategory = await Membercategory.find(searchOptions);
    res.render('categories/index', {
      membercategory: membercategory,
      searchOptions: req.query,
      pageTitle: 'All Categories',
    });
  } catch {
    res.redirect('categories', {
      membercategory: membercategory,
      errorMessage: 'There was an error listing categories.',
      pageTitle: 'All Categories',
    });
  }
});

//New Category Route
router.get('/newcategory', authController.restrictTo('superAdmin'), (req, res) => {
  //   res.render('categories/newcategory');
  res.render('categories/newcategory', { membercategory: new Membercategory(), pageTitle: 'New Category' });
});

//Create category Route
router.post('/', authController.restrictTo('superAdmin'), async (req, res) => {
  const membercategory = new Membercategory({
    memberCategory: req.body.memberCategory.toUpperCase(),
  });

  try {
    const newcategory = await membercategory.save();
    // res.redirect(`categories/${newcategory.id}`);
    res.redirect('/categories');
  } catch {
    res.render('categories/newcategory', {
      membercategory: membercategory,
      errorMessage: 'Error creating category or category already exist. Try again!',
      pageTitle: 'New Category',
    });
  }
});

// Show category by id
router.get('/:id', authController.restrictTo('superAdmin', 'basicAdmin'), async (req, res) => {
  // res.send('Show Category ' + req.params.id);
  try {
    const membercategory = await Membercategory.findById(req.params.id);
    //const className = await ClassName.find({});
    const clubmembers = await ClubMember.find({ memberCategory: membercategory.id }).populate({ path: 'className', model: ClassName }).limit(20).exec();
    res.render('categories/show', {
      membercategory: membercategory,
      assignedMembers: clubmembers,
      pageTitle: 'Category Details',
    });
  } catch {
    res.redirect('/categories');
  }
});

// Edit category by id //
router.get('/:id/edit', authController.restrictTo('superAdmin'), async (req, res) => {
  // res.send('Edit Category ' + req.params.id);
  try {
    const membercategory = await Membercategory.findById(req.params.id);
    // if (membercategory.memberCategory != 'STARTER | POINT: 1') {
    //   res.render('categories/edit', {
    //     membercategory: membercategory,
    //   });
    // } else {
    //   res.redirect('/categories');
    // }
    res.render('categories/edit', {
      membercategory: membercategory,
      pageTitle: 'Edit Category',
    });
    //res.redirect('/categories');
  } catch {
    res.redirect('/categories');
  }
});

// Update category by id //
router.put('/:id', authController.restrictTo('superAdmin'), async (req, res) => {
  // res.send('Update Category ' + req.params.id);
  let membercategory;

  try {
    membercategory = await Membercategory.findById(req.params.id);

    membercategory.memberCategory = req.body.memberCategory.toUpperCase();
    await membercategory.save();
    //res.redirect(`/categories/${membercategory.id}`);
    res.redirect('/categories');

    // res.render('categories/listcategories', {
    //   membercategory: membercategory,
    //   successMessage: `Membership category "${membercategory.memberCategory}" updated!`,
    // });
  } catch {
    if (membercategory == null) {
      res.redirect('/categories');
    } else {
      res.render('categories/edit', {
        membercategory: membercategory,
        errorMessage: 'Error updating category. Try again!',
        pageTitle: 'Update Category',
      });
    }
  }
});

// Delete category by id
router.delete('/:id', authController.restrictTo('superAdmin'), async (req, res) => {
  // res.send('Delete Category ' + req.params.id);
  let membercategory;
  try {
    membercategory = await Membercategory.findById(req.params.id);
    // if (membercategory.memberCategory != 'STARTER | POINT: 1') {
    // }
    await membercategory.remove();
    res.redirect('/categories');
  } catch {
    if (membercategory == null) {
      res.redirect('/categories');
    } else {
      res.redirect('/categories');
      //res.redirect(`/categories/${membercategory.id}`);
    }
  }
});

module.exports = router;

// successMessage: `Category ${memberCategory.memberCategory} has been deleted successfully`
// errorMessage: 'An Error occurred while attempting to delete category'
