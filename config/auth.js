exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isverified) {
      return next();
    }
    req.logout();
    req.flash('error_msg', 'Email not verified');
    res.redirect('/users/login');
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/users/login');
};

exports.ensureAuthenticatedLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isverified) {
      res.redirect('/home');
    }
  }
  return next();
};

exports.ensureAuthenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isadmin == true) {
      return next();
    }
    req.logout();
    req.flash('error_msg', 'Login as Administrator to continue');
    res.redirect('/admin/login');
  }
  req.flash('error_msg', 'Please log in as administrator to view that resource');
  res.redirect('/admin/login');
};

exports.ensureAuthenticatedAdminLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isadmin == true) {
      res.redirect('/admin');
    }
  }
  return next();
};
