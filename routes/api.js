var express = require('express');
var router = express.Router();

const Event = require('../models/event');

router.get('/events/:id', (req, res, next) => {
  var eventId = req.params.id;
  Event.findById(eventId)
    .then((event) => {
      console.log(event);
      res.json(event);
    });
});

module.exports = router;
