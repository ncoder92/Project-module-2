const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

const bcryptSalt = 10;

/* GET login page. */
router.get('/login', function (req, res, next) {
  if (req.session.currentUser) {
    return res.redirect('/events');
  }
  const data = {
    usernameField: ''
  };
  res.render('auth/login', data);
});

/* POST login page. */
router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/events');
  }

  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    const data = {
      usernameField: username,
      message: 'Indicate a username and a password to login. Remember that the password needs to be at least 8 characters long'
    };
    return res.render('auth/login', data);
  }

  User.findOne({ 'username': username })
    .then((user) => {
      if (!user) {
        const data = {
          usernameField: username,
          message: 'Username or password are incorrect'
        };
        return res.render('auth/login', data);
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.redirect('/events');
      } else {
        const data = { usernameField: username, message: 'Username or password are incorrect. Remember that the password needs to be at least 8 characters long' };
        res.render('auth/login', data);
      }
    })
    .catch(next);
});

/* render the signup form. */
router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/events');
  }
  const data = {
    fields: {
      name: '',
      username: '',
      email: ''
    }
  };
  res.render('auth/signup', data);
});

/* handle the POST from the signup form. */
router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/events');
  }

  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // validate
  if (username === '' || password === '' || password.length < 8 || email === '') {
    const data = {
      message: 'Invalid username or password. Make sure your password has at least 8 characters',
      fields: {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email
      }
    };
    return res.render('auth/signup', data);
  }

  // check if user with this username already exists
  User.findOne({ 'username': username })
    .then((user) => {
      if (user) {
        const data = {
          message: 'The "' + username + '" username already exists',
          fields: {
            name: req.body.name,
            username: '',
            email: req.body.email
          }
        };
        return res.render('auth/signup', data);
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        username,
        email,
        password: hashPass
      });

      newUser.save()
        .then(() => {
          req.session.currentUser = newUser;
          return res.redirect('/events');
        })
        .catch(next);
    })
    .catch(next);
});

/* handle the POST from the logout button. */
router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  return res.redirect('/events');
});

module.exports = router;
