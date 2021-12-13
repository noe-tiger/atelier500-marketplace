var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // send back a link in json
  res.json({
    message: 'Welcome to the API, here is the link',
    link: 'https://go.postman.co/workspace/My-Workspace~26639049-f236-4240-8a52-f971b654b15d/collection/7576004-14be1eb4-3f85-4fa9-835d-5c015d841aa8',
  });
});

module.exports = router;
