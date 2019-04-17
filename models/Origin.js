const mongoose = require('mongoose');

const OriginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('origin', OriginSchema);
