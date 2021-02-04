const mongoose = require('mongoose');
const path = require('path');

const sitelogoSchema = new mongoose.Schema({
  sitelogo: {
    type: Buffer,
    required: true,
  },
  sitelogoType: {
    type: String,
    required: true,
  },
});

// Creat a virtual variable to obtain the path to the coverImage on file system
sitelogoSchema.virtual('sitelogoPath').get(function () {
  if (this.sitelogo != null && this.sitelogoType != null) {
    return `data:${this.sitelogoType}; charset=utf-8; base64, ${this.sitelogo.toString('base64')}`;
  }
});

module.exports = mongoose.model('Sitelogo', sitelogoSchema);
