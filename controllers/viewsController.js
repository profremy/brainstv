// Require models that you want to use in the home/index route
const ClubMember = require('../models/clubmember');
const Show = require('../models/show');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getIndex = catchAsync(async (req, res, next) => {
  let recentMembers;
  try {
    recentMembers = await ClubMember.find({ role: { $nin: ['superAdmin', 'basicAdmin'] } })
      .sort({ dateJoined: -1 })
      .limit(15)
      .exec();
  } catch {
    recentMembers = [];
  }
  res.status(200).render('index', { recentMembers: recentMembers, pageTitle: 'Welcome to BrainsTv' });
});

// This route works without any queries since user is already logged in
exports.getAccount = (req, res) => {
  res.status(200).render('clubmembers/profile/account', {
    pageTitle: 'Update Account Settings',
  });
};
