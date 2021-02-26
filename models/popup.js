const mongoose = require('mongoose');
const path = require('path');

const popupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true,
    },
  },
  subtitle: { type: String, required: true },
  footer: { type: String, required: true },
  popupBackground: {
    type: Buffer,
    required: true,
  },
  popupBackgroundType: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

// Creat a virtual variable to obtain the path to the popup background on file system
popupSchema.virtual('popupBackgroundPath').get(function () {
  if (this.popupBackground != null && this.popupBackgroundType != null) {
    return `data:${this.popupBackgroundType}; charset=utf-8; base64, ${this.popupBackground.toString('base64')}`;
  }
});
module.exports = mongoose.model('Popup', popupSchema);
