const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getCaseStudies,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} = require('../controllers/caseStudyController');

// Public
router.get('/',    getCaseStudies);
router.get('/:id', getCaseStudyById);

// Admin protected
router.post('/',      protect, createCaseStudy);
router.put('/:id',    protect, updateCaseStudy);
router.delete('/:id', protect, deleteCaseStudy);

module.exports = router;
