const express = require('express');
const router = express.Router();
const ClubMember = require('../models/clubmember');

//All Users Route
router.get('/', async (req, res) => {
  // only admin users can view this router

  res.render('clubmembers/index');
});

//New User Route
router.get('/newClubMember', (req, res) => {
  res.render('clubmembers/newclubmember');
});

//Thank you for Registering page
router.get('/registered', (req, res) => {
  res.render('clubmembers/registered');
});

//Create New User Route
router.post('/', async (req, res) => {
  //res.send('Create ClumbMember');
  try {
    console.log(req.body);
    res.redirect('clubmembers/registered');
  } catch (err) {
    res.render('clubmembers/newclubmember', {
      errorMessage: 'There was an error, review all fields highlighted in red and try again.',
    });
  }
});

module.exports = router;
