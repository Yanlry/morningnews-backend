const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  token: String,
  canBookmark: Boolean,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
