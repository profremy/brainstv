const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    index: { unique: true },
  },
  adminRole: {
    type: String,
    default: 'basicAdmin',
  },
  userPassword: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Admin', adminSchema); //Admin is the name of the table
