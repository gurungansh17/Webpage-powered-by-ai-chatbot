const Article = require('../models/Article');

// ─── GET /api/articles ───────────────────────────────────────────────────────
// Public — Get all published articles (FR9)
const getPublishedArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' }).sort({ createdAt: -1 });
    return res.json(articles);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve articles.' });
  }
};

// ─── GET /api/articles/all ───────────────────────────────────────────────────
// Admin only — Get all articles including drafts (FR7)
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).populate('createdBy', 'username');
    return res.json(articles);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve articles.' });
  }
};

// ─── GET /api/articles/:id ───────────────────────────────────────────────────
// Public — Get single article by ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found.' });
    return res.json(article);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve article.' });
  }
};

// ─── POST /api/articles ──────────────────────────────────────────────────────
// Admin only — Create a new article (FR7)
const createArticle = async (req, res) => {
  try {
    const { title, body, status } = req.body;
    const article = await Article.create({
      title,
      body,
      status: status || 'draft',
      createdBy: req.admin.id,
    });
    return res.status(201).json({ message: 'Article created successfully.', article });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create article.' });
  }
};

// ─── PUT /api/articles/:id ───────────────────────────────────────────────────
// Admin only — Update an article (FR7)
const updateArticle = async (req, res) => {
  try {
    const { title, body, status } = req.body;
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { title, body, status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!article) return res.status(404).json({ error: 'Article not found.' });
    return res.json({ message: 'Article updated successfully.', article });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update article.' });
  }
};

// ─── DELETE /api/articles/:id ────────────────────────────────────────────────
// Admin only — Delete an article
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found.' });
    return res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete article.' });
  }
};

module.exports = {
  getPublishedArticles,
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
