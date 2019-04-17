const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser'); // Used to parse the cookie header and populate req.cookies
const logger = require('morgan'); // An HTTP request logger middleware for node.
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');

const User = require('./models/user');

const app = express();

// Passport Config
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
// const usersRouter = require('./routes/users');

// DB Config
const db = require('./config/keys.js').mongoURI;

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('MongoDB Connect Error:', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(session({ secret: 'harisiqbal', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  next();
});

// Routers Config
app.use('/', indexRouter);
app.use('/admin', adminRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404);
  res.render('404');
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
