const express = require('express');

const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../config/auth');

// @route   GET /users/login
// @desc    Show Login Page
// @access  Everyone
router.get('/login', auth.ensureAuthenticatedLogin, usersController.login_get);

// @route   GET /users/register
// @desc    Show Register Page
// @access  Everyone
router.get('/register', usersController.register_get);

// @route   POST /users/login
// @desc    Authenticate User
// @access  Everyone
router.post('/login', usersController.login_post);

// @route   POST /users/logout
// @desc    Log User Out
// @access  Everyone
router.get('/logout', usersController.logout_post);

// @route   POST /users/register
// @desc    Register User
// @access  Everyone
router.post('/register', usersController.register_post);

// @route   GET /users/forgotpassword
// @desc    Show Forgot Password Page
// @access  Everyone
router.get('/forgotpassword', usersController.forgotpassword_get);

// @route   POST /users/forgotpassword
// @desc    Send Forgot Password Email
// @access  Everyone
router.post('/forgotpassword', usersController.forgotpassword_post);

// @route   POST /users/editprofile
// @desc    Save Changes to User
// @access  Everyone
router.post('/editprofile', usersController.editprofile_post);

// @route   POST /users/changepassword
// @desc    Change User Password
// @access  Everyone
router.post('/changepassword', usersController.changepassword_post);


module.exports = router;
