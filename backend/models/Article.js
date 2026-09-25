const mongoose = require('mongoose');

// D2a — Articles collection
const articleSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Article title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'Article body is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
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

module.exports = mongoose.model('Article', articleSchema);
