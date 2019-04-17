const express = require('express');

const router = express.Router();
const auth = require('../config/auth');

const adminController = require('../controllers/adminController');

// @route   GET /admin
// @desc    Go to admin dashboard
// @access  Admin
router.get('/', auth.ensureAuthenticatedAdmin, adminController.dashboard_get);

// @route   GET /admin/login
// @desc    Show Admin Login Page
// @access  Public
router.get('/login', auth.ensureAuthenticatedAdminLogin, adminController.adminlogin_get);

// @route   POST /admin/login
// @desc    Authenticate Admin
// @access  Public
router.post('/login', adminController.adminlogin_post);

// @route   GET /admin/categories
// @desc    Add a food caterogry
// @access  Private
router.get('/categories', auth.ensureAuthenticatedAdmin, adminController.categories_get);

// @route   GET /admin/items/list/:categoryid
// @desc    Show Items in a particular category
// @access  Private
router.get('/items/list/:categoryid', auth.ensureAuthenticatedAdmin, adminController.items_get);

// @route   GET /admin/categories/add
// @desc    Add a food caterogry
// @access  Private
router.get('/categories/add', auth.ensureAuthenticatedAdmin, adminController.addcategory_get);

// @route   POST /admin/categories/add
// @desc    Add a food caterogry
// @access  Private
router.post('/categories/add', auth.ensureAuthenticatedAdmin, adminController.addcategory_post);

// @route   GET /admin/categories/edit/:categoryid
// @desc    Edit a food caterogry
// @access  Private
router.get('/categories/edit/:categoryid', auth.ensureAuthenticatedAdmin, adminController.editcategory_get);

// @route   POST /admin/categories/edit
// @desc    Add a food caterogry
// @access  Private
router.post('/categories/edit', auth.ensureAuthenticatedAdmin, adminController.editcategory_post);

// @route   GET /admin/categories/addbulk
// @desc    Add food caterogries using excel file
// @access  Private
router.get('/categories/addbulk', auth.ensureAuthenticatedAdmin, adminController.addcategorybulk_get);

// @route   POST /admin/categories/addbulk
// @desc    Add food caterogries using excel file
// @access  Private
router.post('/categories/addbulk', auth.ensureAuthenticatedAdmin, adminController.addcategorybulk_post);

// @route   POST /admin/categories/delete/:categoryid
// @desc    Delete a food category
// @access  Private
router.post('/categories/delete/:categoryid', auth.ensureAuthenticatedAdmin, adminController.deletecategory_post);

// @route   GET /admin/items/add
// @desc    Add a food Item
// @access  Private
router.get('/items/add', auth.ensureAuthenticatedAdmin, adminController.additem_get);

// @route   POST /admin/items/add
// @desc    Add a food Item
// @access  Private
router.post('/items/add', auth.ensureAuthenticatedAdmin, adminController.additem_post);

// @route   GET /admin/items/edit/:itemid
// @desc    Show Edit food Item Page
// @access  Private
router.get('/items/edit/:itemid', auth.ensureAuthenticatedAdmin, adminController.edititem_get);

// @route   POST /admin/items/edit
// @desc    Edit food Item
// @access  Private
router.post('/items/edit', auth.ensureAuthenticatedAdmin, adminController.edititem_post);

// @route   GET /admin/items/addbulk
// @desc    Add food Items using excel file
// @access  Private
router.get('/items/addbulk', auth.ensureAuthenticatedAdmin, adminController.additembulk_get);

// @route   POST /admin/items/addbulk
// @desc    Add food Items using excel file
// @access  Private
router.post('/items/addbulk', auth.ensureAuthenticatedAdmin, adminController.additembulk_post);

// @route   POST /admin/items/delete/:itemid
// @desc    Delete a food item
// @access  Private
router.post('/items/delete/:itemid', auth.ensureAuthenticatedAdmin, adminController.deleteitem_post);

module.exports = router;
