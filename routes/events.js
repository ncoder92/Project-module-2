const express = require('express');
const router = express.Router();
const moment = require('moment');

const User = require('../models/user');
const Event = require('../models/event');

// GET ('/events')
router.get('/', function (req, res, next) {
  Event.find({})
    .then((results) => {
      let formattedDates = [];
      results.forEach((event) => {
        formattedDates.push(moment(event.eventDate).format('ddd, MMM D, YYYY, h:mm A'));
      });
      const data = {
        results,
        formattedDates
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
    return res.redirect('/events');
  }
  const title = req.body.title;
  const description = req.body.description;
  const eventDate = moment(req.body.date).format('ddd, MMM D, YYYY, h:mm A');
  const eventLocation = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };

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
    description,
    eventLocation,
    eventDate
  });
  let newEventId;

  newEvent.save()
    .then((eventCreated) => {
      newEventId = eventCreated._id;
      return User.findByIdAndUpdate(req.session.currentUser._id, { $push: { owned: eventCreated._id } }, { new: true });
    })
    .then((user) => {
      req.session.currentUser = user;
      res.redirect(`/events/${newEventId}`);
    })
    .catch(next);
});

// GET ('/events/:Id')
router.get('/:id', (req, res, next) => {
  const eventId = req.params.id;
  const currentUser = req.session.currentUser;
  let isOwner = false;

  if (currentUser) {
    for (let i = 0; i < currentUser.owned.length; i++) {
      if (currentUser.owned[i] === eventId) {
        isOwner = true;
      }
    }
  }

  Event.findById(eventId).populate('attendees')
    .then((event) => {
      let alreadyAttending = false;
      let data = {
        title: event.title,
        description: event.description,
        id: event._id,
        attendeeCount: event.attendees.length,
        eventDate: moment(event.eventDate).format('ddd, MMM D, YYYY, h:mm A')
      };
      console.log(data.eventDate);
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
  const currentUser = req.session.currentUser;
  if (!currentUser) {
    return res.redirect('/events');
  }
  const eventId = req.params.id;
  let alreadyAttending = false;

  Event.findById(eventId).populate('attendees')
    .then((result) => {
      for (let i = 0; i < result.attendees.length; i++) {
        if (result.attendees[i]._id.equals(currentUser._id)) {
          alreadyAttending = true;
        }
      }
      if (alreadyAttending) {
        return Event.findByIdAndUpdate(eventId, { $pull: {attendees: currentUser._id} });
      } else {
        return Event.findByIdAndUpdate(eventId, { $push: {attendees: currentUser._id} });
      }
    })
    .then(() => { res.redirect(`/events/${eventId}`); })
    .catch(next);
});

module.exports = router;
