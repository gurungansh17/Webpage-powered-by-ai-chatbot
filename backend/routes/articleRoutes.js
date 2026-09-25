const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getPublishedArticles,
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

// Public
router.get('/',    getPublishedArticles);
router.get('/:id', getArticleById);

// Admin protected
router.get('/admin/all', protect, getAllArticles);
router.post('/',         protect, createArticle);
router.put('/:id',       protect, updateArticle);
router.delete('/:id',    protect, deleteArticle);

module.exports = router;
