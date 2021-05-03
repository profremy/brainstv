const path = require('path');

const dotenv = require('dotenv');
const result = dotenv.config({ path: './.env' });
// if (process.env.NODE_ENV !== 'production') {
// }

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! Shutting down ...');
  process.exit(1);
});

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// const indexRouter = require('./routes/index');
//const loginRouter = require('./routes/llogin');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const brainstvadminRouter = require('./routes/brainstvadmins');
const brainstvRouter = require('./routes/brainstv');
const clubMemberRouter = require('./routes/clubmembers');
const categoryRouter = require('./routes/categories');
const sitelogoRouter = require('./routes/sitelogos');
const flashinfoRouter = require('./routes/flashinfos');
const popupRouter = require('./routes/popups');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

// Import model to expose local variables to all routes
// Then use app.locals.<variable name> = <variable> in app.use(function) below
const Sitelogo = require('./models/sitelogo');
const Flashinfo = require('./models/flashinfo');
const ClubMember = require('./models/clubmember');
const Membercategory = require('./models/category');
const Popup = require('./models/popup');
const ClassName = require('./models/class');
const Show = require('./models/show');

const app = express();

const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
//For Production server only
const DB = process.env.DB_CONN_STRING.replace('<password>', process.env.DB_CONN_PW);

// For local server use
//const DB = process.env.DB_LOCAL_CONN_STRING;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

// Set up global middleware for app

//This is for setting HTTP security headers. Should be on top of middleware stack
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: ["'self'", 'https:', 'http:', 'blob:', 'https://*.mapbox.com', 'https://js.stripe.com', 'https://m.stripe.network', 'https://*.cloudflare.com'],
        frameSrc: ["'self'", 'https://js.stripe.com', 'data:', '*.youtube.com', '*.youtube-nocookie.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        workerSrc: ["'self'", 'data:', 'blob:', 'https://*.tiles.mapbox.com', 'https://api.mapbox.com', 'https://events.mapbox.com', 'https://m.stripe.network'],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'data:', '*.ytimg.com', 'blob:'],
        formAction: ["'self'"],
        connectSrc: ["'self'", "'unsafe-inline'", 'data:', 'blob:', 'https://*.stripe.com', '*.unpkg.com', 'https://*.mapbox.com', 'https://*.cloudflare.com/', 'https://bundle.js:*', 'ws://localhost:*/', 'http://localhost:*/'],
        upgradeInsecureRequests: [],
      },
    },
  })
); // calling helmet produces the middleware function itself.

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 requests per hour ( 60mins * 60secs * 1000milliseconds)
  message: 'Too many requests from this IP, please try again in an hour!.',
});
app.use('/api', limiter);

app.use(expressLayouts);
app.use(methodOverride('_method'));

// Serving static files
app.use(express.static('public'));
// app.use(express.static(`${__dirname}/public`));

// BodyParser, reading data from body into req.body
// This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10kb' })); // this is bodyParser for postman testing
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS - cross site scripting
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['gender', 'dob', 'email', 'firstname', 'lastname'],
  })
);

// Compression for requests
app.use(compression());

// Making variables available with app.locals and res.locals
app.use(async (req, res, next) => {
  let sitelogo, flashinfo;
  sitelogo = await Sitelogo.findOne({});
  flashinfo = await Flashinfo.findOne({}).sort({ createdAt: -1 });

  if (flashinfo != null) {
    res.locals.loadSiteFlashInfo = flashinfo.flashInfoText;
  } else {
    res.locals.loadSiteFlashInfo = '';
  }

  if (sitelogo != null) {
    res.locals.loadSiteLogo = sitelogo.sitelogoPath;
  } else {
    res.locals.loadSiteLogo = '';
  }
  app.locals.clubmembers = await ClubMember.find({}).populate({ path: 'className', model: ClassName }).sort({ dateJoined: -1 });
  app.locals.popups = await Popup.findOne({});
  app.locals.membercategories = await Membercategory.find({});
  app.locals.classes = await ClassName.find({});
  app.locals.allShows = await Show.find({}).sort({ datePosted: -1 });
  next();
});

// Middleware to initialize user
app.use(function (req, res, next) {
  res.locals.user = null;
  next();
});

// Middleware to check request time and headers
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  //console.log(req.cookies);

  next();
});

// Connect to live database
mongoose
  .connect(DB, {
    //Arguments used to deal with application warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connection to Mongoose Successful!'));
// .catch((err) => console.log('ERROR'));
/* 
.then((con) => {
    //console.log(con.connections);
    console.log('Local db Connection to Mongoose Successful!');
  });
*/
// const db = mongoose.connection;
// db.on('error', (error) => console.error(error));
// db.once('open', () => console.log('Live db Connection to Mongoose Successful!'));

app.use('/', viewRouter);
app.use('/brainstvadmins', brainstvadminRouter);
app.use('/brainstv', brainstvRouter);
app.use('/clubmembers', clubMemberRouter);
app.use('/categories', categoryRouter);
app.use('/sitelogos', sitelogoRouter);
app.use('/flashinfos', flashinfoRouter);
app.use('/popups', popupRouter);
app.use('/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`The requested url ${req.originalUrl} could not be found on this server!`, 404));
});

app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down ...');
  server.close(() => {
    process.exit(1);
  });
});
