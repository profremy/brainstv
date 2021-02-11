//New Site Logo Route
const express = require('express');
const router = express.Router();
const path = require('path');
const Flashinfo = require('../models/flashinfo');

// Flash info page Route
router.get('/', async (req, res) => {
  // Only admin users can view this route
  let searchOptions = {};
  if (req.query.flashInfoText != null && req.query.flashInfoText !== '') {
    searchOptions.flashInfoText = new RegExp(req.query.flashInfoText, 'i');
  }
  const flashinfo = await Flashinfo.find({}).sort({ createdAt: -1 });

  res.render('flashinfos/index', {
    flashinfo: flashinfo,
    searchOptions: searchOptions,
  });
});

// New flash info page Route
router.get('/new', async (req, res) => {
  res.render('flashinfos/new', { flashinfo: new Flashinfo() });
});

// Save New Flash info
router.post('/', async (req, res) => {
  const flashinfo = new Flashinfo({
    flashInfoText: req.body.flashInfoText,
  });

  try {
    const newFlashInfo = await flashinfo.save();
    res.redirect('/flashinfos');
  } catch {
    res.render('flashinfos/new', {
      flashinfo: flashinfo,
      errorMessage: 'Error saving flash info',
    });
  }
});

// Show flash info by id
router.get('/:id', async (req, res) => {
  try {
    const flashinfo = await Flashinfo.findById(req.params.id);
    res.render('flashinfos/show', {
      flashinfo: flashinfo,
    });
  } catch {
    res.redirect('/flashinfos');
  }
});

// Edit info by id
router.get('/:id/edit', async (req, res) => {
  try {
    const flashinfo = await Flashinfo.findById(req.params.id);
    if (flashinfo.flashInfoText != 'NO FLASH INFORMATION AVAILABLE') {
      res.render('flashinfos/edit', {
        flashinfo: flashinfo,
      });
    } else {
      res.redirect('/flashinfos/index');
    }
  } catch {
    res.redirect('/flashinfos/index');
  }
});

// Update flashinfo by id
router.put('/:id', async (req, res) => {
  let flashtext;

  try {
    flashtext = await Flashinfo.findById(req.params.id);
    flashtext.flashInfoText = req.body.flashInfoText;

    await flashtext.save();
    res.redirect('/flashinfos');
  } catch (err) {
    console.log(err);
    res.redirect('/flashinfos');
  }
});

// Delete flash info by id
router.delete('/:id', async (req, res) => {
  let flashinfo;
  try {
    // const msgs = await Flashinfo.find({});
    flashinfo = await Flashinfo.findById(req.params.id);
    if (flashinfo.flashInfoText != 'NO FLASH INFORMATION AVAILABLE') {
      await flashinfo.remove();
      res.redirect('/flashinfos');
    } else {
      res.render('flashinfos/show', {
        flashinfo: flashinfo,
        errorMessage: `Cannot remove default "${flashinfo.flashInfoText}".`,
      });
    }
  } catch {
    if (flashinfo != null) {
      res.render('flashinfos/show', {
        flashinfo: flashinfo,
        errorMessage: 'Could not remove flash info',
      });
    } else {
      res.redirect('/flashinfos/index');
    }
  }
});

module.exports = router;
