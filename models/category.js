const mongoose = require('mongoose');
const ClubMember = require('./clubmember');

const membercategorySchema = new mongoose.Schema({
  memberCategory: {
    type: String,
    required: true,
    unique: true,
  },
});

// Set up constraint that prevents a category in use from being removed
membercategorySchema.pre('remove', function (next) {
  ClubMember.find({ memberCategory: this.id }, (err, clubmembers) => {
    if (err) {
      next(err);
    } else if (clubmembers.length > 0) {
      next(new Error('This Category is assigned to a member'));
    } else {
      next();
    }
  });
});
module.exports = mongoose.model('Membercategory', membercategorySchema); //MemberCategory is the name of the table
