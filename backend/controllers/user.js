const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
     const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then( result => {
      res.status(201).json({
        message: 'User created succesfully',
        result: result
      });
    })
    .catch( err => {
      res.status(500).json({
          message: 'Invalid authentication credentials'
      })
    });
  });
}

exports.loginUser = (req, res, next) => {
  let fetChedUser;
  User.findOne({email: req.body.email})
  .then(user => {
    if(!user){
      return res.status(404).json({
        message: 'User not found'
      });
    }
    fetChedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        message: 'Invalid Authentication Credentials'
      });
    }
    const token = jwt.sign({email: fetChedUser.email, userId: fetChedUser._id}, process.env.JWT_KEY, {expiresIn: "1h"});
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetChedUser._id
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Invalid Authentication Credentials'
    });
  });
}

exports.deleteUser = (req, res, next) => {
  User.deleteOne({_id: req.params.id})
  .then(result => {
    res.status(200).json({
      message: 'User deleted'
    });
  });
}
