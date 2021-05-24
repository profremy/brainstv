const mongoose = require('mongoose');

const livestreamSchema = new mongoose.Schema({
  livestreamURL: {
    type: String,
    required: [true, 'Livestream URL is required'],
    unique: true,
  },
});

const Livestream = mongoose.model('Livestream', livestreamSchema);
module.exports = Livestream;
