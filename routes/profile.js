var express = require('express');
var router = express.Router();

const User = require('../models/user');

// GET ('/profile/myevents')
router.get('/my-events/:userId', (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId).populate('owned')
    .then((userData) => {
      const data = {
        events: userData.owned
      };
      res.render('profiles/profile', data);
    })
    .catch(next);
});

// POST ('/profile/myevents/:Id')

module.exports = router;
