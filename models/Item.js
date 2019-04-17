const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  origins: [{
    type: String
  }],
  searchtags: [{
    type: String,
  }],
});

module.exports = mongoose.model('item', ItemSchema);
