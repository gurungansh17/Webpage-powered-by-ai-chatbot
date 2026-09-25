const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  submitEnquiry,
  getAllEnquiries,
  getEnquiryById,
  deleteEnquiry,
} = require('../controllers/enquiryController');

// Public
router.post('/', submitEnquiry);

// Admin protected
router.get('/',       protect, getAllEnquiries);
router.get('/:id',    protect, getEnquiryById);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
