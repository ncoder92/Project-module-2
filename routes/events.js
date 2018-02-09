var express = require('express');
var router = express.Router();

const Event = require('../models/event');

// GET ('/events')
router.get('/', function (req, res, next) {
  res.render('events/events');
});

// GET ('/events/new')

// POST ('/events') Crear nuevo

// GET ('/events/:Id')

// POST ('/events/:Id') Attend

module.exports = router;
