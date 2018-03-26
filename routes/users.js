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
    email    : req.body.email,
    password: req.body.password 
  });

  User.addUser(newUser, (err, user) => {
    if(err) {
      res.json({ success: false, msg: 'Failed to register user' });
    } else {
      res.json({ success: true, msg: 'User register Successfully'});
    }
  });
});

// Login
router.post('/login', (req, res,next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) {
      throw err;
    }

    if(!user) {
      return res.json({ success: true, msg: 'User not found' });
    }

    User.comparePassword(password, user.password, (err, isMatch) =>{
      if(err) {
        throw err;
      }

      if(isMatch) {
        const token = jwt.sign({ data:user }, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          } 
        });
      } else {
        return res.json({ success: false, msg: "Wrong password" });
      }
    });
  });
});

// authenticate is also a method of passport
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

router.route('/:userId')
  .delete(User.deleteUser)
  .put(User.updateUser);

// export the router
module.exports = router;