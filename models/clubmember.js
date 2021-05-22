const crypto = require('crypto');
const mongoose = require('mongoose');
const path = require('path');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// const profileImageBasePath = 'uploads/profileImages';

const clubmemberSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Please tell us your first name'],
  },
  lastname: {
    type: String,
    required: [true, 'Please tell us your last name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    lowercase: true,
    index: {
      unique: true,
      dropDups: true,
    },
    validated: [validator.isEmail, 'Please provide a valid email'],
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
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
  role: {
    type: String,
    enum: ['superAdmin', 'basicAdmin', 'clubMember'],
    default: 'clubMember',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 6,
    select: false, //Never show password in any output though encrypted
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    // This only works on Create and Save!
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'The passwords do not match!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  dateJoined: {
    type: Date,
    required: true,
    default: Date.now,
  },
  memberCategory: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
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
  photo: {
    type: String,
    default: 'birthday.png',
  },
  signedConsent: {
    type: String,
    required: true,
  },
  className: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    ref: 'ClassName ',
  },
});

clubmemberSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

clubmemberSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // Put the passwordChangedAt 1 second in the past.
  next();
});

// Query middleware to prevent the display if inactive Clubmembers (Temporary Deactivation)
clubmemberSchema.pre(/^find/, function (next) {
  // this points to the current query
  //this.find({ active: true }); // active property set to true
  this.find({ active: { $ne: false } }); //not equal to false
  next();
});

// TEST this code before shipping for production to minimize repeat of populate in clubmemberController
// clubmemberSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'memberCategory' }).populate({ path: 'className', model: ClassName });
// });

// INSTANCE METHODs - Available on all documents or instances of a certain collection
// This will be used to compare sign in password
// Note that since 'select: false' is on password field, 'this.password' will not be available
clubmemberSchema.methods.correctPassword = async function (candidatePassword, memberPassword) {
  return await bcrypt.compare(candidatePassword, memberPassword);
};

clubmemberSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // convert to base 10

    //console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

clubmemberSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  //console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 60-secs 1000-millisecs

  return resetToken;
};

// Virtual Field
clubmemberSchema.virtual('profileImagePath').get(function () {
  if (this.profileImage != null && this.profileImageType != null) {
    return `data:${this.profileImageType}; charset=utf-8; base64, ${this.profileImage.toString('base64')}`;
  }
});

const Clubmember = mongoose.model('Clubmember', clubmemberSchema);

module.exports = Clubmember;
//export not as default but as a named variable
// module.exports.profileImageBasePath = profileImageBasePath;
