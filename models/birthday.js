const mongoose = require('mongoose');
const path = require('path');

const birthdaySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name of celebrant is required'],
    },
    birthdayMessage: {
      type: String,
      required: [true, 'Birthday message is required'],
    },
    birthdayCard: {
      type: Buffer,
      required: true,
    },
    birthdayCardType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

birthdaySchema.virtual('birthdayCardPath').get(function () {
  if (this.birthdayCard != null && this.birthdayCardType != null) {
    return `data:${this.birthdayCardType}; charset=utf-8; base64, ${this.birthdayCard.toString('base64')}`;
  }
});

const Birthday = mongoose.model('Birthday', birthdaySchema);
module.exports = Birthday;
