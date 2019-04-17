const passport = require('passport');
const tokenGen = require('../helpers/randomstring');
const User = require('../models/user');

// GET Display Login Page
exports.login_get = (req, res, next) => {
  res.render('login');
};

// GET Display Register Page
exports.register_get = (req, res, next) => {
  res.render('register');
};

// POST Authenticate User
exports.login_post = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
};

// POST Log user Out
exports.logout_post = (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
};

// POST Register User
exports.register_post = (req, res, next) => {
  const fname = req.body.fname.trim();
  const lname = req.body.lname.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const password2 = req.body.password2.trim();
  const verifytoken = tokenGen(40);
  const errors = [];

  if (fname == '' || lname == '' || email == '' || password == '' || password2 == '') {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      fname,
      lname,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email }).then((user) => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          fname,
          lname,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          firstname: fname,
          lastname: lname,
          email,
          verifytoken,
        });

        User.register(newUser, password, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      }
    });
  }
};

// GET Display Forgot Password Page
exports.forgotpassword_get = (req, res, next) => {
  res.render('forgotpassword');
};

// GET Display Forgot Password Page
exports.forgotpassword_post = (req, res, next) => {
  const email = req.body.email.trim();
  const errors = [];

  if (email == '') {
    errors.push({ msg: 'Enter an Email' });
  }

  if (errors.length > 0) {
    res.render('forgotpassword', {
      errors,
    });
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        res.send(`Sending Email to ${user.firstname} ${user.lastname}`);
      } else {
        res.send('Email not found!');
      }
    });
  }
};

// POST Save changes to user profile
exports.editprofile_post = (req, res, next) => {
  const fname = req.body.fname.trim();
  const lname = req.body.lname.trim();
  const errors = [];

  if (fname == '' || lname == '') {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('editprofile', { errors });
  } else {
    User.findOneAndUpdate({ email: req.user.email }, { firstname: fname, lastname: lname })
      .then(user => res.redirect('/home'))
      .catch(err => console.log(err));
  }
};

exports.changepassword_post = (req, res, next) => {
  const currentpassword = req.body.currentpassword.trim();
  const password = req.body.password.trim();
  const password2 = req.body.password2.trim();
  const errors = [];

  if (currentpassword == '' || password == '' || password2 == '') {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6 || password2.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (currentpassword == password) {
    errors.push({ msg: 'Please type a new password' });
  }

  if (errors.length > 0) {
    res.render('changepassword', { errors });
  } else {
    User.findOne({ email: req.user.email }).then((user) => {
      user.changePassword(currentpassword, password)
        .then((data) => {
          console.log(data);
          req.flash('success_msg', 'Password changed successfully');
          res.redirect('changepassword');
        })
        .catch((err) => {
          errors.push({ msg: 'Current password is incorrect' });
          res.render('changepassword', { errors });
          res.send(err);
        });
    });
  }
};
