const mongoose = require('mongoose');

// D6 — Case Studies collection
const caseStudySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Case study title is required'],
    maxlength: [150],
    trim: true,
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    maxlength: [100],
    trim: true,
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    maxlength: [1000],
    trim: true,
  },
  outcome: {
    type: String,
    maxlength: [300],
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

module.exports = mongoose.model('CaseStudy', caseStudySchema);
