const mongoose = require('mongoose');
const { urlRegex } = require('../utils/regex');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(urlRegex),
      message: 'invalid url',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(urlRegex),
      message: 'invalid url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('card', articleSchema);
