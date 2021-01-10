const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  siteLogoImage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('SiteLogo', logoSchema); //SiteLogo is the name of the table
