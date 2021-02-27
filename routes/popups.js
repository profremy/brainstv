//New Site Logo Route
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Popup = require('../models/popup');

const imageMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

// All Popups Route
router.get('/', async (req, res) => {
  // Only admin users can view this route
  const popup = await Popup.find({});

  res.render('popups/index', {
    popup: popup,
  });
});

// New site logo Route
router.get('/new', async (req, res) => {
  // A function created at the bottom of the page for this purpose
  try {
    const popup = await Popup.findOne({});
    if (popup === null) {
      renderNewPopup(res, new Popup());
    } else {
      res.render('popups/index', { popup: popup, errorMessage: 'Popup already uploaded. You may Edit popup!' });
    }
  } catch {
    res.redirect('/');
  }
});

// Save New popup
router.post('/', async (req, res) => {
  const popup = new Popup({
    title: req.body.title,
    subtitle: req.body.subtitle,
    footer: req.body.footer,
    popupBackground: req.body.popupBackground,
    popupBackgroundType: req.body.popupBackgroundType,
  });

  saveSitePopup(popup, req.body.popupBackground);
  try {
    const newPopup = await popup.save();
    res.redirect('/brainstvadmins');
  } catch {
    renderNewPopup(res, popup, true);
  }
});

// Show popup by id
router.get('/:id', async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id);
    res.render('popups/show', {
      popup: popup,
    });
  } catch {
    res.redirect('/popups');
  }
});

// Edit popup by id
router.get('/:id/edit', async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id);
    renderEditPopup(res, popup);
  } catch {
    res.redirect('/brainstvadmins');
  }
});

// Update popup by id
router.put('/:id', async (req, res) => {
  let popup;

  try {
    popup = await Popup.findById(req.params.id);
    popup.title = req.body.title;
    popup.subtitle = req.body.subtitle;
    popup.footer = req.body.footer;
    popup.title = req.body.title;

    if (req.body.popupBackground != null && req.body.popupBackground !== '') {
      saveSitePopup(popup, req.body.popupBackground);
    }
    await popup.save();

    res.redirect(`/popups/${popup.id}`);
  } catch (err) {
    console.log(err);
    if (popup != null) {
      renderEditLogo(res, popup, true);
    } else {
      res.redirect('/popups');
    }
  }
});

// Delete popup by id
router.delete('/:id', async (req, res) => {
  let popup, popupCount;
  try {
    popupCount = await Popup.find({});
    popup = await Popup.findById(req.params.id);
    if (popupCount.length > 1) {
      await popup.remove();
      res.redirect('/popups');
    } else {
      res.render('popups/index', {
        popup: popup,
        errorMessage: 'Cannot delete popup. Edit popup instead!',
      });
    }
  } catch {
    if (popup != null) {
      res.render('popups/show', {
        popup: popup,
        errorMessage: 'Could not remove popup',
      });
    } else {
      res.redirect('/popups/index');
    }
  }
});

async function renderNewPopup(res, popup, hasError = false) {
  try {
    const params = {
      popup: popup,
    };

    if (hasError) params.errorMessage = 'An error occurred while processing popup. Try again!';
    res.render('popups/new', params);
  } catch {
    res.redirect('/popups/index');
  }
}

async function renderEditPopup(res, popup, hasError = false) {
  try {
    const params = {
      popup: popup,
    };

    if (hasError) params.errorMessage = 'An error occurred while processing popup. Try again!';
    res.render('popups/edit', params);
  } catch {
    res.redirect('/popups/edit', {
      errorMessage: 'There was an error trying to update popup!.',
    });
  }
}

function saveSitePopup(popup, popupBackgroundImageEncoded) {
  if (popupBackgroundImageEncoded == null) return;
  const popupBackgroundImage = JSON.parse(popupBackgroundImageEncoded);
  if (popupBackgroundImage != null && imageMimeTypes.includes(popupBackgroundImage.type)) {
    popup.popupBackground = new Buffer.from(popupBackgroundImage.data, 'base64');
    popup.popupBackgroundType = popupBackgroundImage.type;
  }
}
module.exports = router;