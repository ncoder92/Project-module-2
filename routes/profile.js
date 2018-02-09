var express = require('express');
var router = express.Router();

// GET ('/profile/myevents')
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// POST ('/profile/myevents/:Id')

module.exports = router;
