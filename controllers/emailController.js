const fsPromises = require('fs').promises;
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const nodemailer = require('nodemailer');
const path = require('path');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // use the filter to test if the file is an image. Test for file type here

  if (file.mimetype.startsWith('image')) {
    // pass null or no error to callback with true - its an image
    cb(null, true);
  } else if (file.originalname.split('.')[1] === 'mp3') {
    // pass null or no error to callback with true - its a .ejs file
    cb(null, true);
  } else if (file.originalname.split('.')[1] === 'mp4') {
    cb(null, true);
  } else {
    // pass an error message to callback with false - its not an image
    cb(new AppError('File type not acceptable! Please upload only relevant file.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadActivityTakePartFile = upload.single('selectedActivityTakePartFile');
exports.uploadContactUsAttachmentFile = upload.single('contactUsAttachment');

exports.attachmentHandler = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  if (req.file.fieldname === 'selectedActivityTakePartFile') {
    req.file.filename = `${req.originalname}`;
    await fsPromises.writeFile(`public/uploads/temp-uploads/${req.file.filename}`, req.file.buffer);

    return next();
  }

  if (req.file.fieldname === 'contactUsAttachment') {
    req.file.filename = `${req.originalname}`;
    await fsPromises.writeFile(`public/uploads/temp-uploads/${req.file.filename}`, req.file.buffer);

    return next();
  }
});

const emailTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.BTV_EMAIL_HOST,
      port: process.env.BTV_EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.BTV_EMAIL,
        pass: process.env.BTV_EMAIL_PASSWORD,
      },
      //Transport Layer Security - use only for testing on local server
      tls: { rejectUnauthorized: false },
    });
  }

  return nodemailer.createTransport({
    host: process.env.BTV_EMAIL_NOSSL_HOST,
    port: process.env.BTV_EMAIL_NOSSL_PORT,
    secure: false,
    auth: {
      user: process.env.BTV_EMAIL,
      pass: process.env.BTV_EMAIL_PASSWORD,
    },

    //Transport Layer Security - use only for testing on local server
    tls: { rejectUnauthorized: false },
  });
};

exports.mailActivityTakePart = catchAsync(async (req, res, next) => {
  // Establish filename
  if (req.file) {
    req.file.filename = req.file.originalname;
    await fsPromises.writeFile(`public/uploads/temp-uploads/${req.file.filename}`, req.file.buffer);
  }

  const webForm = `
  <h2>User Activity / Take Part </h2>
    <p>A Club Member has sent in the following home work</p>
    <ul>
      <li>Name: ${req.body.fullname}</li>
      <li>Email: ${req.body.email}</li>
      <li>File: ${req.file.filename}</li>
    </ul>
  `;

  // Setup email data
  const mailOptions = {
    from: '"BrainsTV Club" <publicemail@brainstv.com>', // sender address
    to: process.env.BTV_EMAIL, // list of receivers
    subject: 'Home Work', // Subject line
    //text: 'Hello world?', // plain text body
    html: webForm, // html body
    attachments: [
      {
        filename: req.file.filename,
        path: `public/uploads/temp-uploads/${req.file.filename}`,
      },
    ],
  };

  // Send mail with defined transport object
  await emailTransporter().sendMail(mailOptions);
  await fsPromises.unlink(`public/uploads/temp-uploads/${req.file.filename}`);

  next();
});

exports.mailContactForm = catchAsync(async (req, res, next) => {
  var detailstr = req.body.subjectDetails;
  var fullnamestr = req.body.fullname;

  if (new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(detailstr) || new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(fullnamestr)) {
    // return new AppError('URL is not accepted on this form!.', 400), false;
    return res.render('brainstv/contact-us', {
      pageTitle: 'Contact us',
      errorMessage: 'URL is not accepted on this form!',
    });
  }

  const webForm = `
    <h2>User Contact Form Submission </h2>
    <p>A Club Member has sent the following from the contact form</p>
    <ul>
      <li>Name: ${req.body.fullname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.telephone}</li>
      <li>Subject: ${req.body.subject}</li>
      <li>Details: <p>${req.body.subjectDetails}</p></li>
      <li>SignedConsent: ${req.body.signedConsent}</li>
    </ul>
  `;

  // Establish filename
  if (req.file) {
    const filename = req.file.originalname;
    await fsPromises.writeFile(`public/uploads/temp-uploads/${filename}`, req.file.buffer);

    // Setup email data
    const mailOptions = {
      from: '"BrainsTV Club" <publicemail@brainstv.com>', // sender address
      to: process.env.BTV_EMAIL, // list of receivers
      subject: req.body.subject, // Subject line
      //text: 'Hello world?', // plain text body
      html: webForm, // html body
      attachments: [
        {
          filename: filename,
          path: `public/uploads/temp-uploads/${filename}`,
        },
      ],
    };

    // Send mail with defined transport object
    await emailTransporter().sendMail(mailOptions);
    await fsPromises.unlink(`public/uploads/temp-uploads/${filename}`);

    return next();
  }

  // Setup email data with no file attachment
  const mailOptions = {
    from: '"BrainsTV Club" <publicemail@brainstv.com>', // sender address
    to: process.env.BTV_EMAIL, // list of receivers
    subject: req.body.subject, // Subject line
    //text: 'Hello world?', // plain text body
    html: webForm, // html body
  };

  // Send mail with defined transport object
  await emailTransporter().sendMail(mailOptions);

  return next();
});

exports.sendClassQuestion = catchAsync(async (req, res, next) => {
  const webForm = `
  <h2>E-Class Question</h2>
    <p>A Club Member has sent in the following question</p>
    <ul>
      <li>Name: ${req.body.fullname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Question: ${req.body.askQuestion}</li>
    </ul>
  `;

  // Setup email data
  const mailOptions = {
    from: '"BrainsTV Club" <publicemail@brainstv.com>', // sender address
    to: process.env.BTV_EMAIL, // list of receivers
    subject: 'E-Class Question', // Subject line
    //text: 'Hello world?', // plain text body
    html: webForm, // html body
  };

  // Send mail with defined transport object
  await emailTransporter().sendMail(mailOptions);

  next();
});
