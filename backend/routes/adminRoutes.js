const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { loginAdmin, getAdminProfile, seedAdmin } = require('../controllers/adminController');

// Public
router.post('/login', loginAdmin);
router.post('/seed',  seedAdmin); // One-time use — disable/remove in production

// Admin protected
router.get('/me', protect, getAdminProfile);

module.exports = router;
