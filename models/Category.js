const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
  },
});

module.exports = mongoose.model('category', CategorySchema);
