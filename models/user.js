const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  joined: {
    type: Date,
    default: Date.now,
  },
  isadmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isverified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verifytoken: {
    type: String,
    required: true,
    default: 'verified',
  }
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', UserSchema);
