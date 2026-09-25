const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getSolutions,
  getSolutionById,
  createSolution,
  updateSolution,
  deleteSolution,
} = require('../controllers/solutionController');

// Public
router.get('/',    getSolutions);
router.get('/:id', getSolutionById);

// Admin protected
router.post('/',      protect, createSolution);
router.put('/:id',    protect, updateSolution);
router.delete('/:id', protect, deleteSolution);

module.exports = router;
