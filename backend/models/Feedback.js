const mongoose = require('mongoose');

// D4 — Feedback collection
const feedbackSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    maxlength: [100],
    trim: true,
  },
  companyName: {
    type: String,
    maxlength: [150],
    trim: true,
    default: null,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'hidden'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
