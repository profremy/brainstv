const express = require('express');
const router = express.Router();

//Shows
router.get('/shows', (req, res) => {
  res.render('brainstv/shows');
});

//Games
router.get('/games', (req, res) => {
  res.render('brainstv/games');
});

//Videos
router.get('/videos', (req, res) => {
  res.render('brainstv/videos');
});

//Activities
router.get('/activities', (req, res) => {
  res.render('brainstv/activities');
});

//Take Part
router.get('/takepart', (req, res) => {
  res.render('brainstv/takepart');
});

//E-classroom
router.get('/eclassroom', (req, res) => {
  res.render('brainstv/eclassroom');
});

//Newsroom
router.get('/newsupdate', (req, res) => {
  res.render('brainstv/newsupdate');
});

//Privacy Policy
router.get('/privacy-policy', (req, res) => {
  res.render('brainstv/privacy-policy');
});

//Our Terms
router.get('/our-terms', (req, res) => {
  res.render('brainstv/our-terms');
});
//Questions and Answers
router.get('/question-and-answers', (req, res) => {
  res.render('brainstv/question-and-answers');
});

//Contact Us
router.get('/contact-us', (req, res) => {
  res.render('brainstv/contact-us');
});

//Advertise
router.get('/advertise', (req, res) => {
  res.render('brainstv/advertise');
});

//Shop
router.get('/shop', (req, res) => {
  res.render('brainstv/shop');
});

module.exports = router;
