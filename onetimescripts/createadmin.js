const mongoose = require('mongoose');
const db = require('../config/keys').mongoURI;
const User = require('../models/user');
const tokenGen = require('../helpers/randomstring');

// DB Config
mongoose.connect(db, {
  useNewUrlParser: true,
})
  .then(() => {
    const verifytoken = tokenGen(40);
    const password = 'default123';
    console.log('MongoDB Connected...');
    const newAdmin = new User({
      firstname: 'Matthew',
      lastname: 'B',
      email: 'matthew@rareflavorco.com',
      verifytoken,
      isadmin: true,
      isverified: true,
    });

    User.register(newAdmin, password, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Admin Created: \n', user);
      }
    });
  })
  .catch(err => console.log(err));
