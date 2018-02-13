var express = require('express');
var router = express.Router();

const User = require('../models/user');
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
    return res.redirect('/events');
  }
  res.render('events/new');
});

// POST ('/events') Crear nuevo
router.post('/', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/events');
  }
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
    .then((eventCreated) => {
      return User.findByIdAndUpdate(req.session.currentUser._id, { $push: { owned: eventCreated._id } });
    })
    .then(() => res.redirect('/'))
    .catch(next);
});

// GET ('/events/:Id')
router.get('/:id', (req, res, next) => {
  const eventId = req.params.id;
  const currentUser = req.session.currentUser;
  let isOwner = false;

  for (let i = 0; i < currentUser.owned.length; i++) {
    if (currentUser.owned[i] === eventId) {
      isOwner = true;
    }
  }

  Event.findById(eventId).populate('attendees')
    .then((event) => {
      let alreadyAttending = false;
      let data = {
        title: event.title,
        description: event.description,
        id: event._id
      };

      if (!currentUser) {
        data.status = 'not logged in';
      } else {
        for (let i = 0; i < event.attendees.length; i++) {
          if (event.attendees[i]._id.equals(currentUser._id)) {
            alreadyAttending = true;
          }
        }
      }
      if (isOwner) {
        data.status = 'owner';
      } else if (alreadyAttending) {
        data.status = 'attending';
      } else if (!alreadyAttending && currentUser) {
        data.status = 'not attending';
      }
      res.render('events/details', data);
    })
    .catch(next);
});

// POST ('/events/:Id') Attend
router.post('/:id', (req, res, next) => {
  const eventId = req.params.id;
  const currentUser = req.session.currentUser;
  let alreadyAttending = false;
  let data = {};

  if (!currentUser) {
    res.redirect('/events');
  }

  Event.findById(eventId).populate('attendees')
    .then((result) => {
      for (let i = 0; i < result.attendees.length; i++) {
        if (result.attendees[i]._id.equals(currentUser._id)) {
          alreadyAttending = true;
        }
      }
      if (alreadyAttending) {
        data = {
          title: result.title,
          description: result.description,
          id: result._id,
          status: 'not attending'
        };
        return Event.findByIdAndUpdate(eventId, { $pull: {attendees: currentUser._id} });
      } else {
        data = {
          title: result.title,
          description: result.description,
          id: result._id,
          status: 'attending'
        };
        return Event.findByIdAndUpdate(eventId, { $push: {attendees: currentUser._id} });
      }
    })
    .then(() => { res.redirect(`/events/${eventId}`); })
    .catch(next);
});

module.exports = router;
