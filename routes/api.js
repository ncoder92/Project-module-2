const express = require('express');
const router = express.Router();

const Event = require('../models/event');

router.get('/events/:id', (req, res, next) => {
  const eventId = req.params.id;
  Event.findById(eventId)
    .then((event) => {
      console.log(event);
      res.json(event);
    });
});

module.exports = router;
