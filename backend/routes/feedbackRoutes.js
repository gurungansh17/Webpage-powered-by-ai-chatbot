const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getApprovedFeedback,
  getAllFeedback,
  submitFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} = require('../controllers/feedbackController');

// Public
router.get('/',  getApprovedFeedback);
router.post('/', submitFeedback);

// Admin protected
router.get('/admin/all',         protect, getAllFeedback);
router.patch('/:id/status',      protect, updateFeedbackStatus);
router.delete('/:id',            protect, deleteFeedback);

module.exports = router;
