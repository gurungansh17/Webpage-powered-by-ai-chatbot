const mongoose = require('mongoose');

// D2b — Events collection
const eventSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true,
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  location: {
    type: String,
    maxlength: [200, 'Location cannot exceed 200 characters'],
    trim: true,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', eventSchema);
