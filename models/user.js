const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const SALT_WORK_FACTOR = 10;

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
}, { timestamp: true });

const User = module.exports = mongoose.model('User', UserSchema);

// GET request
module.exports.getUserById = function(id, callback) {
  User.findById(id,callback);
}

// GET request
module.exports.getUserByEmail = function(email, callback) {
  const query = { email: email }
  User.findOne(query, callback);
}

// GET request
module.exports.getUserByUsername = function(username, callback) {
  const query = { username: username }
  User.findOne(query, callback);
}

// POST request
module.exports.addUser = function(newUser, callback) {
  // Using salt to encrypt password in mongodb
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err,  hash) => {
      if(err) {
        throw err;
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

// Compare password for login authentication
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) {
      throw err;
    } 
    callback(null, isMatch);
  });
}

// Update User information, name or email
// module.exports.updateUserInfo = function() {
//   User.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, user) {
//     res.send(user);
//   });
// }

module.exports.updateUser = function(req, res) {
  User.findOneAndUpdate({ _id: req.params.userId }, req.body, 
  {new: true})
    .then(function(user) {
      res.json(user);
    })
    .catch(function(err) {
      res.send(err);
    })
}

// Delete an User
// module.exports.removeUser = function() {
//   User.findByIdAndRemove(req.params.id, (err, user) => {
//     if(err) {
//       return res.status(500).send(err);
//     }

//     const res = {
//       message: "User sucessfully deleted",
//       id: user._id
//     };
//     return res.status(200).send(response);
//   });
// }

module.exports.deleteUser = function(req, res) {
  User.remove( { _id: req.params.userId })
    .then(function(){
      res.json({ message: 'We delete it!'})
    })
    .catch(function (err) {
      res.send(err);
    })
}