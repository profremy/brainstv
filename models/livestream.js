const mongoose = require('mongoose');
const ClassName = require('./class');

const livestreamSchema = new mongoose.Schema(
  {
    livestreamURL: {
      type: String,
      required: [true, 'Livestream URL is required'],
      unique: true,
    },
    className: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassName ',
    },
  },
  { timestamps: true }
);

livestreamSchema.pre(/^find/, function (next) {
  this.find().sort({ datePosted: -1 });
  this.populate({ path: 'className', model: ClassName, select: '-__v' });
  next();
});

const Livestream = mongoose.model('Livestream', livestreamSchema);
module.exports = Livestream;
