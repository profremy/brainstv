const path = require('path');
var result;
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  result = dotenv.config({ path: './.env' });

  // check that .env is loading
  if (result.error) {
    throw result.error;
  }
  console.log(result.parsed);
  //console.log(process.env)
}
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 5000;
const DB = process.env.DB_CONN_STRING.replace('<password>', process.env.DB_CONN_PW);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static('public'));

/*
// Connect to live database
mongoose
  .connect(DB, {
    //Arguments used to deal with application warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connection Successful!'));
*/
/*
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
*/

// Connect to local database
mongoose.connect(process.env.DATABASE_LOCAL, {
  //Arguments used to deal with application warnings
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Local db Connection to Mongoose Successful'));

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
