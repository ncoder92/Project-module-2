const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const EventSchema = new Schema({
  title: String,
  description: String,
  attendees: [{ type: objectId, ref: 'User' }],
  active: {
    type: Boolean,
    default: true
  }
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
