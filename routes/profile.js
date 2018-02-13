var express = require('express');
var router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');

// GET ('/profile/myevents')
router.get('/my-events', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/events');
  }
  User.findById(req.session.currentUser._id).populate('owned')
    .then((userData) => {
      const data = {
        events: userData.owned
      };
      res.render('profiles/profile', data);
    })
    .catch(next);
});

// POST ('/profile/myevents/:Id')
router.post('/my-events/:eventId', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/events');
  }
  const eventId = req.params.eventId;
  Event.findByIdAndUpdate(eventId, { $set: { active: false } })
    .then(() => {
      res.redirect('/profile/my-events');
    })
    .catch(next);
});

module.exports = router;
