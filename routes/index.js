const express = require('express');
const router = express.Router();

// Require models that you want to use in the home/index route
const ClubMember = require('../models/clubmember');

router.get('/', async (req, res) => {
  let recentMembers;
  try {
    recentMembers = await ClubMember.find().sort({ dateJoined: 'desc' }).limit(15).exec();
  } catch {
    recentMembers = [];
  }
  res.render('index', { recentMembers: recentMembers });
});

module.exports = router;
