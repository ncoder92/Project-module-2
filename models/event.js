const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: String,
  description: String,
  atendees: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
