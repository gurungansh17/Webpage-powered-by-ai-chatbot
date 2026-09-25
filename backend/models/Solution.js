const mongoose = require('mongoose');

// D5 — Solutions collection
const solutionSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Solution title is required'],
    maxlength: [150],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Solution description is required'],
    maxlength: [1000],
    trim: true,
  },
  iconOrImage: {
    type: String,
    maxlength: [500],
    trim: true,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Solution', solutionSchema);
