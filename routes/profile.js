var express = require('express');
var router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');

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
router.post('/my-events/:eventId', (req, res, next) => {
  const eventId = req.params.eventId;
  Event.findByIdAndUpdate(eventId, { $set: { active: false } })
    .then((eventData) => {
      const data = {
        events: eventData
      };
      console.log(req.session.currentUser);
      res.redirect(`/profile/my-events/${req.session.currentUser._id}`);
    })
    .catch(next);
});

module.exports = router;
