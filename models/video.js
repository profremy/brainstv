const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoTitle: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true,
    },
  },
  videoID: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true,
    },
  },
  videoThumbnail: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    required: true,
    default: Date.now,
  },
  className: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ClassName',
  },
});

module.exports = mongoose.model('Video', videoSchema);
