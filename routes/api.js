const express = require('express');
const router = express.Router();

const Event = require('../models/event');

router.get('/events/:id', (req, res, next) => {
  const eventId = req.params.id;
  Event.findById(eventId)
    .then((event) => {
      if (!event) {
        throw new Error('Could not find event');
      }
      res.json(event);
    })
    .catch(next);
});

module.exports = router;
