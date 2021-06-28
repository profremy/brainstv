const mongoose = require('mongoose');

const whenCanYouStopSchema = new mongoose.Schema(
  {
    whenCanYouStop: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Whencanyoustop = mongoose.model('Whencanyoustop', whenCanYouStopSchema);

module.exports = Whencanyoustop;
