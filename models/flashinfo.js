const mongoose = require('mongoose');

const flashinfoSchema = new mongoose.Schema({
  flashInfoText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('Flashinfo', flashinfoSchema);
