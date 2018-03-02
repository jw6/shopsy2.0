const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User schema
const UserSchema = mongoose.Schema({
  name: {
    type: String, required: true, lowercase: true, trim: true,
  },
  username: {
    type: String, required: true, index: { unique: true }, lowercase: true, trim: true,
  },
  email: {
    type: String, required: true, index: { unique: true }, lowercase: true, trium: true,
  },
  password: {
    type: String, required: true, trim: true,
  },
}, { timestamp: true })

const User = module.exports = mongoose.model('User', UserSchema);