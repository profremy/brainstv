const mongoose = require('mongoose');

const mumAndDadSchema = new mongoose.Schema(
  {
    mostAdmired: {
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

const MostAdmired = mongoose.model('MostAdmired', mumAndDadSchema);

module.exports = MostAdmired;
