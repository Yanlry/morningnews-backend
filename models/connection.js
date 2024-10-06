const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.CONNECTION_STRING;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

module.exports = mongoose;
