const mongoose = require('mongoose');
const path = require('path');

// const profileImageBasePath = 'uploads/profileImages';

const clubmemberSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true,
    },
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  dateJoined: {
    type: Date,
    required: true,
    default: Date.now,
  },
  memberCategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Membercategory',
  },
  pointsEarned: {
    type: Number,
    required: true,
    default: 1,
  },
  // profileImageName: {
  //   type: String,
  //   required: false,
  // },
  profileImage: {
    type: Buffer,
    required: false,
  },
  profileImageType: {
    type: String,
    required: false,
  },
  signedConsent: {
    type: String,
    required: true,
  },
});

// Creat a virtual variable to obtain the path to the coverImage on file system
// clubmemberSchema.virtual('profileImagePath').get(function () {
//   if (this.profileImageName !== null) {
//     return path.join('/', profileImageBasePath, this.profileImageName);
//   }
// });
clubmemberSchema.virtual('profileImagePath').get(function () {
  if (this.profileImage != null && this.profileImageType != null) {
    return `data:${this.profileImageType}; charset=utf-8; base64, ${this.profileImage.toString('base64')}`;
  }
});

module.exports = mongoose.model('Clubmember', clubmemberSchema); //clubmembers is the name of the table

//export not as default but as a named variable
// module.exports.profileImageBasePath = profileImageBasePath;
