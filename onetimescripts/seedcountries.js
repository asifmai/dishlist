const mongoose = require('mongoose');
const fs = require('fs');
const Foodorigin = require('../models/Origin');

// DB Config
const db = require('../config/keys').mongoURI;

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('MongoDB Connect Error:', err));

const rawCountries = fs.readFileSync('countries.json');
const countries = JSON.parse(rawCountries);
countries.forEach(async (country, index) => {
  const newCountry = new Foodorigin({
    code: country.code,
    name: country.name,
  });
  await newCountry.save();
  console.log(`${index} saved ${newCountry.name}`);
});
