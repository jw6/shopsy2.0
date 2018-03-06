const express  = require('express');
const router   = express.Router();
const passport = require('passport');
const jwt      = require('jsonwebtoken');
const config   = require('../config/database');

const User     = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name    : req.body.name,
    username: req.body.username,
    emai    : req.body.email,
    password: req.body.password 
  });

  User.addUser(newUser, (err, user) => {
    if(err) {
      res.json({ success: false, msg: 'Failed to register user' });
    } else {
      res.json({ success: true, msg: 'User register Successfully'})
    }
  })
})