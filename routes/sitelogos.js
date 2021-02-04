//New Site Logo Route
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Sitelogo = require('../models/sitelogo');

const imageMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

// Site logo Page Route
router.get('/', async (req, res) => {
  // Only admin users can view this route
  const sitelogo = await Sitelogo.findOne({});

  res.render('sitelogos/index', {
    sitelogo: sitelogo,
  });
});

// New site logo Route
router.get('/new', async (req, res) => {
  // A function created at the bottom of the page for this purpose
  try {
    const sitelogo = await Sitelogo.findOne({});
    if (sitelogo === null) {
      renderNewLogo(res, new Sitelogo());
    } else {
      res.render('sitelogos/index', { sitelogo: sitelogo, errorMessage: 'Logo already uploaded. Click on Logo to Delete or Change!' });
    }
  } catch {
    res.redirect('/');
  }
});

// Save New site logo
router.post('/', async (req, res) => {
  const sitelogo = new Sitelogo({
    sitelogo: req.body.sitelogo,
  });

  saveSiteLogo(sitelogo, req.body.sitelogo);
  try {
    const newSitelogo = await sitelogo.save();
    res.redirect('/brainstvadmins');
  } catch {
    renderNewLogo(res, sitelogo, true);
  }
});

// Show site logo by id
router.get('/:id', async (req, res) => {
  try {
    const sitelogo = await Sitelogo.findById(req.params.id);
    res.render('sitelogos/show', {
      sitelogo: sitelogo,
    });
  } catch {
    res.redirect('/sitelogos');
  }
});

// Edit site logo by id
router.get('/:id/edit', async (req, res) => {
  try {
    const sitelogo = await Sitelogo.findById(req.params.id);
    renderEditLogo(res, sitelogo);
  } catch {
    redirect('/brainstvadmins');
  }
});

// Update site logo by id
router.put('/:id', async (req, res) => {
  let logoimage;

  try {
    logoimage = await Sitelogo.findById(req.params.id);
    //logoimage.sitelogo = req.body.sitelogo;

    if (req.body.sitelogo != null && req.body.sitelogo !== '') {
      saveSiteLogo(logoimage, req.body.sitelogo);
    }
    await logoimage.save();

    res.redirect(`/sitelogos/${logoimage.id}`);
    //res.redirect('/sitelogos');
  } catch (err) {
    console.log(err);
    if (logoimage != null) {
      renderEditLogo(res, logoimage, true);
    } else {
      redirect('/sitelogos');
    }
  }
});

// Delete logo by id
router.delete('/:id', async (req, res) => {
  let sitelogo;
  try {
    sitelogo = await Sitelogo.findById(req.params.id);
    await sitelogo.remove();
    res.redirect('/sitelogos');
  } catch {
    if (sitelogo != null) {
      res.render('sitelogos/show', {
        sitelogo: sitelogo,
        errorMessage: 'Could not remove site logo',
      });
    } else {
      res.redirect('/sitelogos/index');
      //res.redirect(`/categories/${membercategory.id}`);
    }
  }
});

async function renderNewLogo(res, sitelogo, hasError = false) {
  try {
    const params = {
      sitelogo: sitelogo,
    };

    if (hasError) params.errorMessage = 'An error occurred while processing logo. Try again!';
    res.render('sitelogos/new', params);
  } catch {
    res.redirect('/sitelogos/index');
  }
}

async function renderEditLogo(res, sitelogo, hasError = false) {
  try {
    const params = {
      sitelogo: sitelogo,
    };

    if (hasError) params.errorMessage = 'An error occurred while processing logo. Try again!';
    res.render('sitelogos/edit', params);
  } catch {
    res.redirect('/sitelogos/edit', {
      errorMessage: 'There was an error trying to update sitelogo!.',
    });
  }
}

function saveSiteLogo(sitelogo, siteLogoImageEncoded) {
  if (siteLogoImageEncoded == null) return;
  const sitelogoImage = JSON.parse(siteLogoImageEncoded);
  if (sitelogoImage != null && imageMimeTypes.includes(sitelogoImage.type)) {
    sitelogo.sitelogo = new Buffer.from(sitelogoImage.data, 'base64');
    sitelogo.sitelogoType = sitelogoImage.type;
  }
}
module.exports = router;
