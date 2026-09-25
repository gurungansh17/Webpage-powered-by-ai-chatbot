const mongoose = require('mongoose');

// D1 — Enquiries collection
const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    maxlength: [150, 'Email cannot exceed 150 characters'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    maxlength: [20, 'Phone cannot exceed 20 characters'],
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    maxlength: [150, 'Company name cannot exceed 150 characters'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    maxlength: [100, 'Country cannot exceed 100 characters'],
    trim: true,
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    maxlength: [100, 'Job title cannot exceed 100 characters'],
    trim: true,
  },
  jobDetails: {
    type: String,
    required: [true, 'Job details are required'],
    maxlength: [2000, 'Job details cannot exceed 2000 characters'],
    trim: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Enquiry', enquirySchema);
