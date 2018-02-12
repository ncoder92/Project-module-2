var express = require('express');
var router = express.Router();

const Event = require('../models/event');

// GET ('/events')
router.get('/', function (req, res, next) {
  Event.find({})
    .then((results) => {
      const data = {
        results
      };
      res.render('events/events', data);
    })
    .catch(next);
});

// GET ('/events/new')
router.get('/new', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  res.render('events/new');
});

// POST ('/events') Crear nuevo
router.post('/', (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;

  if (title === '') {
    const data = {
      message: 'Title cannot be empty'
    };
    return res.render('events/new', data);
  }
  if (description === '') {
    const data = {
      message: 'Description cannot be empty'
    };
    return res.render('events/new', data);
  }

  const newEvent = new Event({
    title,
    description
  });

  newEvent.save()
    .then(() => res.redirect('/'))
    .catch(next);
});

// GET ('/events/:Id')
router.get('/:id', (req, res, next) => {
  const eventId = req.params.id;

  Event.findById(eventId)
    .then((event) => {
      const data = {
        title: event.title,
        description: event.description,
        id: event._id
      };
      res.render('events/details', data);
    })
    .catch(next);
});

// POST ('/events/:Id') Attend
router.post('/:id/:userId', (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.params.userId;

  Event.findByIdAndUpdate(eventId, { $push: { attendees: userId } })
    .then((event) => {
      const data = {
        title: event.title,
        description: event.description,
        id: event._id
      };
      res.render('events/details', data);
    })
    .catch(next);
});

module.exports = router;
