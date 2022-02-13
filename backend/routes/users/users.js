var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
const { validateToken } = require('../middleware/validateToken');

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

var refreshTokens = []
function generateRefreshToken(user) {
  token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '20m' });
  refreshTokens.push(token);
  return token;
}

// TODO : add address field
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  created_on: Date,
  modified_on: Date
});
var UserModel = mongoose.model('UserModel', UserSchema);

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

router.post('/create', async (req, res, next) => {
  const user = req.body.email
  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  if (!validateEmail(user)) {
    return res.status(400).send({
      message: 'Invalid email address'
    });
  }

  const emailExist = await UserModel.findOne({ username: user });
  if (emailExist) {
    return res.status(400).send({
      message: 'Account with that email address already exists'
    });
  }

  const newUser = new UserModel({
    username: user,
    password: hashedPassword,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    created_on: new Date(),
    modified_on: new Date()
  })

  newUser.save((err, doc) => {
    if (err) {
      res.status(500).send({
        message: err.message
      })
    } else {
      const accessToken = generateAccessToken({ user: user })
      const refreshToken = generateRefreshToken({ user: user })

      res.json({ "message": "User created successfully", "accessToken": accessToken, "refreshToken": refreshToken })
    }
  })

});

router.post('/login', async (req, res, next) => {
  const user = await UserModel.findOne({ username: req.body.email })
  if (user == null) res.status(404).send('User not found')
  bcrypt.compare(req.body.password, user.password).then(result => {
    if (result) {
      const accessToken = generateAccessToken({ user: req.body.name })
      const refreshToken = generateRefreshToken({ user: req.body.name })

      res.json({ "accessToken": accessToken, "refreshToken": refreshToken })
    } else {
      res.status(401).send('invalid login pair')
    }
  });
});

router.post('/refreshToken', function (req, res, next) {
  if (!refreshTokens.includes(req.body.token)) {
    res.status(400).send("Refresh Token Invalid")
    return;
  }

  refreshTokens = refreshTokens.filter((c) => c != req.body.token)

  const accessToken = generateAccessToken({ user: req.body.name })
  const refreshToken = generateRefreshToken({ user: req.body.name })

  res.json({ accessToken: accessToken, refreshToken: refreshToken })
});

router.delete("/logout", validateToken, (req, res, next) => {
  refreshTokens = refreshTokens.filter((c) => c != req.body.token)

  res.status(204).send("Logged out!")
})

module.exports = router;
