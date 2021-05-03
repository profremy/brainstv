// const util = require('util');
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const ClubMember = require('../models/clubmember');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const saveProfilePhoto = require('../utils/saveProfilePhoto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createSendToken = (clubmember, statusCode, res) => {
  const token = signToken(clubmember._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), // convert to millisecs
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  clubmember.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      clubmember,
    },
  });
};

exports.createNewAdminUser = catchAsync(async (req, res, next) => {
  const newClubmember = await ClubMember.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    role: req.body.role,
    dob: req.body.dob,
    phone: req.body.phone,
    city: req.body.city,
    gender: req.body.gender,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    signedConsent: req.body.signedConsent,
  });

  createSendToken(newClubmember, 201, res);
});

exports.join = catchAsync(async (req, res, next) => {
  // const newClubmember = await ClubMember.create({
  const clubmember = new ClubMember({
    memberCategory: req.body.memberCategory,
    className: req.body.className,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    role: req.body.role,
    dob: req.body.dob,
    phone: req.body.phone,
    city: req.body.city,
    gender: req.body.gender,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    signedConsent: req.body.signedConsent,
  });

  if (req.body.profilePhoto != null && req.body.profilePhoto !== '') {
    saveProfilePhoto(clubmember, req.body.profilePhoto); //profilePhoto is the name attr for input type 'file' in form
  }

  const newClubmember = await clubmember.save();

  createSendToken(newClubmember, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide valid email and password', 400));
    // return res.render('login/index', {
    //   errorMessage: 'Please provide email and password',
    // });
  }

  // 2) Check if member exists && password is correct. Password needed inclusion here
  // with ".select('+password')" because select is set to false in model.
  const clubmember = await ClubMember.findOne({ email }).select('+password');
  // correct = await clubmemember.correctPassword(password, clubmemember.password);
  if (!clubmember || !(await clubmember.correctPassword(password, clubmember.password))) {
    return next(new AppError('Incorrect email or password', 401)); //Unauthorized
    // return res.render('login/index', {
    //   errorMessage: 'Incorrect email or password',
    // });
  }

  // 3) If everything is ok, send token to client
  createSendToken(clubmember, 200, res);
});

exports.logout = (req, res) => {
  // Send jwt as token name but without a token, then cookies options with a short time.
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Check if token is Available
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not signed in! Please sign in to get access.', 401)); //Unauthorized
    // return res.render('login/index', {
    //   errorMessage: 'Please log in to access this resource!',
    // });
  }

  // 2) Verify validity of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);

  // 3) Check if user still exists
  const currentMember = await ClubMember.findById(decoded.id); //check if member in the decoded payload exists.
  if (!currentMember) {
    return next(new AppError('The user assigned to this payload does not exist!', 401)); //Unauthorized
    // return res.render('login/index', {
    //   errorMessage: 'The user assigned to this payload does not exist!',
    // });
  }

  // 4) Check if user changed password after the token was issued
  // iat - this is issued at
  if (currentMember.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password. Log in again!', 401)); //Unauthorized
    // return res.render('login/index', {
    //   errorMessage: 'User recently changed password. Log in again!',
    // });
  }

  // Grant access to the requested route
  req.clubmember = currentMember;
  res.locals.user = currentMember;
  next();
});

// Only for rendered pages not to protect routes and there will be no error.
// Token is sent of rendered pages (Note: Authorization headers is for API)
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verify token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      //console.log(decoded);

      // 2) Check if user still exists
      const currentMember = await ClubMember.findById(decoded.id); //check if member in the decoded payload exists.
      if (!currentMember) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      // iat - this is issued at
      if (currentMember.changePasswordAfter(decoded.iat)) {
        return next(); //Unauthorized
      }

      // There is a logged in user - Grant access to the requested route
      // Make user accessible to template
      res.locals.user = currentMember;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// Note: We cannot pass arguments (eg the roles - superAdmin, basicAdmin etc) to a middleware function.
// Instead we create a rapper function with the REST PARAMETER SYNTAX which then returns the middleware function we want.
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // This middleware function now has access to roles because of closure
    // roles array ['superAdmin', 'basicAdmin']. role='clubMember'
    if (!roles.includes(req.clubmember.role)) {
      return next(new AppError('You do not have permission to perform this action', 403)); // Forbidden error
      // return res.render('brainstv/index', {
      //   errorMessage: 'You do not have permission to perform this action!',
      // });
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted emailHelp
  const clubmember = await ClubMember.findOne({ email: req.body.email }).exec();
  if (!clubmember) {
    return next(new AppError(`There is no club member with email address ${req.body.email}`, 404));
    // return next(new AppError('There is no clubmember with email', 404));
  }
  // 2) Generate the random reset token
  const resetToken = clubmember.createPasswordResetToken();
  await clubmember.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/brainstv/clubmembers/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and password confirmation to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: clubmember.email,
      subject: 'Your password reset request token (valid for 10 mins)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: `Token successfully sent to ${clubmember.email}.`,
    });
  } catch (err) {
    clubmember.passwordResetToken = undefined;
    clubmember.passwordResetExpires = undefined;
    await clubmember.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!'), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get clumember based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const clubmember = await ClubMember.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is clubmember, set the new password
  if (!clubmember) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  clubmember.password = req.body.password;
  clubmember.confirmPassword = req.body.confirmPassword;
  clubmember.passwordResetToken = undefined;
  clubmember.passwordResetExpires = undefined;
  await clubmember.save();

  // 3) Update changedPasswordAt property for the clubmember
  // 4) Log the clubmember in, send JWT
  createSendToken(clubmember, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const clubmember = await ClubMember.findById(req.clubmember.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await clubmember.correctPassword(req.body.currentPassword, clubmember.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  clubmember.password = req.body.password;
  clubmember.confirmPassword = req.body.confirmPassword;
  await clubmember.save();
  // clubmember.findByIdAndUpdate will NOT work as intended!

  // 4) Log clubmember in, send JWT
  //createSendToken(clubmember, 200, res);
  createSendToken(clubmember, 200, res);
});
