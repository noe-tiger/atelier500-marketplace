var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { route } = require('.');

// TODO : move to another file
function generateAccessToken(user) {
  return jwt.sigh(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

refreshToken = []
function generateRefreshToken(user) {
  token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '20m' });
  refreshToken.push(token);
  return token;
}

// TODO : handle w/ db
users = []

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async (req, res, next) => {
  const user = req.body.name
  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  users.push({ user: user, password: hashedPassword })

  res.status(201).send('respond with a resource');

  console.log(users)

});

router.post('/login', function (req, res, next) {
  // const user = users.find((c) => c.user === req.body.name)
  // if (user == null) res.status(404).send('User not found')
  // if (await bcrypt.compare(req.body.password, user.password)) {
  //   const accessToken = generateAccessToken({ user: req.body.name })
  //   const refreshToken = generateRefreshToken({ user: req.body.name })

  //   res.json({ "accessToken": accessToken, "refreshToken": refreshToken })
  // } else {
  //   res.status(401).send('Invalid password')
  // }
});

module.exports = router;
