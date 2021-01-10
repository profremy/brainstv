const mongoose = require('mongoose');

const clubmemberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateJoined: {
    type: Date,
    required: true,
    default: Date.now,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  signedConsent: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Clubmember', clubmemberSchema); //User is the name of the table
