const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const result = dotenv.config({ path: './.env' });
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const brainstvadminRouter = require('./routes/brainstvadmins');
const loginRouter = require('./routes/login');
const tvScheduleRouter = require('./routes/tvSchedule');
const brainstvRouter = require('./routes/brainstv');
const clubMemberRouter = require('./routes/clubmembers');
const categoryRouter = require('./routes/categories');
const sitelogoRouter = require('./routes/sitelogos');
const flashinfoRouter = require('./routes/flashinfos');

// Import model to expose local variables to all routes
// Then use app.locals.<variable name> = <variable> in app.use(function) below
const Sitelogo = require('./models/sitelogo');
const Flashinfo = require('./models/flashinfo');
const ClubMember = require('./models/clubmember');
const Membercategory = require('./models/category');

const app = express();

const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const DB = process.env.DB_CONN_STRING.replace('<password>', process.env.DB_CONN_PW);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

// Set up middleware for app

app.use(async (req, res, next) => {
  let sitelogo, flashinfo;
  try {
    app.locals.clubmembers = await ClubMember.find({}).sort({ dateJoined: -1 });
    app.locals.membercategories = await Membercategory.find({});

    sitelogo = await Sitelogo.findOne({});
    flashinfo = await Flashinfo.findOne({}).sort({ createdAt: -1 });

    if (sitelogo || flashinfo) {
      res.locals.loadSiteLogo = sitelogo.sitelogoPath;
      res.locals.loadSiteFlashInfo = flashinfo.flashInfoText;
      next();
    }
  } catch (error) {
    console.log(error);
  }
});

app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// Connect to live database
mongoose.connect(DB, {
  //Arguments used to deal with application warnings
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Live db Connection to Mongoose Successful!'));

app.use('/', indexRouter);
app.use('/brainstvadmins', brainstvadminRouter);
app.use('/login', loginRouter);
app.use('/tvSchedule', tvScheduleRouter);
app.use('/brainstv', brainstvRouter);
app.use('/clubmembers', clubMemberRouter);
app.use('/categories', categoryRouter);
app.use('/sitelogos', sitelogoRouter);
app.use('/flashinfos', flashinfoRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
