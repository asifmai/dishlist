const _ = require('lodash');
const Item = require('../models/Item');
const Category = require('../models/Category');
const shuffle = require('../helpers/shufflearray').shuffle;

// Display Landing Page
module.exports.index_get = async (req, res, next) => {
  const categories = await Category.find();
  const shuffledCategories = shuffle(categories);
  res.render('index', { categories: shuffledCategories });
};

// Display List Page
module.exports.list_get = async (req, res, next) => {
  const sort = req.params.sort;
  const categories = await Category.find();
  const items = await Item.find({ category: req.params.categoryid }).populate('category').exec();
  const sortedItems = _.orderBy(items, sort, 'asc');
  const category = await Category.findById(req.params.categoryid);
  res.render('list', { page: 'listpage', categories, items: sortedItems, category });
};

// Display Search Results
module.exports.search_get = async (req, res, next) => {
  const sort = req.params.sort;
  const categories = await Category.find();
  const allItems = await Item.find().populate('category').exec();
  const searchTerms = req.query.searchterm.toLowerCase().split(' ');
  const filteredItems = [];

  searchTerms.forEach((st) => {
    allItems.forEach((item) => {
      if (item.name.toLowerCase().includes(st)) {
        filteredItems.push(item);
      }

      if (item.category.name.toLowerCase().includes(st)) {
        filteredItems.push(item);
      }

      if (item.searchtags) {
        item.searchtags.forEach((tag) => {
          if (tag.toLowerCase().includes(st)) {
            filteredItems.push(item);
          }
        });
      }

      if (item.origins) {
        item.origins.forEach((origin) => {
          if (origin.toLowerCase().includes(st)) {
            filteredItems.push(item);
          }
        });
      }
    });
  });

  const searchResults = _.uniqWith(filteredItems, _.isEqual);
  const sortedItems = _.orderBy(searchResults, sort, 'asc');
  res.render('results', { page: 'listpage', items: sortedItems, searchterm: req.query.searchterm.toLowerCase(), categories });
};
