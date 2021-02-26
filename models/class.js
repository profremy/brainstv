const mongoose = require('mongoose');
const ClubMember = require('./clubmember');

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true,
    },
  },
});

// Set up constraint that prevents a class in use from being removed
classSchema.pre('remove', function (next) {
  ClubMember.find({ className: this.id }, (err, clubmembers) => {
    if (err) {
      next(err);
    } else if (clubmembers.length > 0) {
      next(new Error('This Class is assigned to a member'));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model('ClassName', classSchema);
