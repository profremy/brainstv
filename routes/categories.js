const express = require('express');
const router = express.Router();
const Membercategory = require('../models/category');
const ClubMember = require('../models/clubmember');

//All Users Route
router.get('/', async (req, res) => {
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
    });
  } catch {
    res.redirect('categories', {
      membercategory: membercategory,
      errorMessage: 'There was an error listing categories.',
    });
  }
});

//New Category Route
router.get('/newcategory', (req, res) => {
  //   res.render('categories/newcategory');
  res.render('categories/newcategory', { membercategory: new Membercategory() });
});

//Create Admin User Route
router.post('/', async (req, res) => {
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
    });
  }
});

// Show category by id
router.get('/:id', async (req, res) => {
  // res.send('Show Category ' + req.params.id);
  try {
    const membercategory = await Membercategory.findById(req.params.id);
    const clubmembers = await ClubMember.find({ memberCategory: membercategory.id }).limit(20).exec();
    res.render('categories/show', {
      membercategory: membercategory,
      assignedMembers: clubmembers,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/categories');
  }
});

// Edit category by id //
router.get('/:id/edit', async (req, res) => {
  // res.send('Edit Category ' + req.params.id);
  try {
    const membercategory = await Membercategory.findById(req.params.id);
    if (membercategory.memberCategory != 'STARTER | POINT: 1') {
      res.render('categories/edit', {
        membercategory: membercategory,
      });
    } else {
      res.redirect('/categories');
    }
  } catch {
    res.redirect('/categories');
  }
});

// Update category by id //
router.put('/:id', async (req, res) => {
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
      });
    }
  }
});

// Delete category by id
router.delete('/:id', async (req, res) => {
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
