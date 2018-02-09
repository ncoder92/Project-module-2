// bin/seeds.js
const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/meetup-db', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

const User = require('../models/user');

// bin/seeds.js

const users = [
  {
    name: 'Filipe',
    username: 'frainho',
    email: 'filipe@gmail.com',
    password: '12345678'
  }
];

// bin/seeds.js
User.create(users, (err, docs) => {
  if (err) {
    throw err;
  }

  docs.forEach((user) => {
    console.log(user.name);
  });
  mongoose.connection.close();
});
