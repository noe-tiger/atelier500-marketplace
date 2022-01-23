var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// TODO : move to another file
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

var refreshTokens = []
function generateRefreshToken(user) {
  token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '20m' });
  refreshTokens.push(token);
  return token;
}

// TODO : handle w/ db
var users = []

router.post('/', async (req, res, next) => {
  const user = req.body.name
  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  users.push({ user: user, password: hashedPassword })

  res.status(201).send('respond with a resource');
});

router.post('/login', function (req, res, next) {
  const user = users.find((c) => c.user === req.body.name)
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

// TODO : find the error
router.post('/refreshToken', function (req, res, next) {
  if (!refreshTokens.includes(req.body.token))
    res.status(400).send("Refresh Token Invalid")

  refreshTokens = refreshTokens.filter((c) => c != req.body.token)
  //remove the old refreshToken from the refreshTokens list

  const accessToken = generateAccessToken({ user: req.body.name })
  const refreshToken = generateRefreshToken({ user: req.body.name })
  //generate new accessToken and refreshTokens

  res.json({ accessToken: accessToken, refreshToken: refreshToken })
});

// TODO : find the error
router.delete("/logout", (req, res, next) => {
  refreshTokens = refreshTokens.filter((c) => c != req.body.token)

  //remove the old refreshToken from the refreshTokens list

  res.status(204).send("Logged out!")
})

module.exports = router;
