const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getUpcomingEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

// Public
router.get('/',    getUpcomingEvents);
router.get('/:id', getEventById);

// Admin protected
router.get('/admin/all', protect, getAllEvents);
router.post('/',         protect, createEvent);
router.put('/:id',       protect, updateEvent);
router.delete('/:id',    protect, deleteEvent);

module.exports = router;
