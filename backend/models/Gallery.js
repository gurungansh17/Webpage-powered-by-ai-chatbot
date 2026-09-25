const mongoose = require('mongoose');

// D2c — Gallery collection
const gallerySchema = new mongoose.Schema({
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null,
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    maxlength: [500],
    trim: true,
  },
  caption: {
    type: String,
    maxlength: [200, 'Caption cannot exceed 200 characters'],
    trim: true,
    default: null,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', gallerySchema);
