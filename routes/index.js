const express = require('express');

const router = express.Router();
const auth = require('../config/auth');

const indexController = require('../controllers/indexController');

// @route   GET /
// @desc    Show Index Page
// @access  Public
router.get('/', indexController.index_get);

// @route   GET /list/:categoryid
// @desc    Show List Page
// @access  Public
router.get('/list/:categoryid/:sort', indexController.list_get);

// @route   GET /search
// @desc    Show Search Results
// @access  Public
router.get('/search/:sort', indexController.search_get);

module.exports = router;
