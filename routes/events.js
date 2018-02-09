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

// POST ('/events/:Id') Attend

module.exports = router;
