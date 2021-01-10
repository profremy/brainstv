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

//Create New User Route
router.post('/', async (req, res) => {
  res.send('Create ClumbMember');
});

module.exports = router;
