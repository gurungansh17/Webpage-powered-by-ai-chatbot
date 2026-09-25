const Feedback = require('../models/Feedback');

// ─── GET /api/feedback ───────────────────────────────────────────────────────
// Public — Get all approved feedback entries (FR9)
const getApprovedFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ status: 'approved' }).sort({ submittedAt: -1 });
    return res.json(feedback);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve feedback.' });
  }
};

// ─── GET /api/feedback/all ───────────────────────────────────────────────────
// Admin only — Get all feedback for moderation
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ submittedAt: -1 })
      .populate('reviewedBy', 'username');
    return res.json(feedback);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve feedback.' });
  }
};

// ─── POST /api/feedback ──────────────────────────────────────────────────────
// Public — Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { customerName, companyName, rating, comment } = req.body;
    const feedback = await Feedback.create({ customerName, companyName, rating, comment });
    return res.status(201).json({
      message: 'Thank you for your feedback! It will be reviewed before publishing.',
      feedback,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit feedback.' });
  }
};

// ─── PATCH /api/feedback/:id/status ─────────────────────────────────────────
// Admin only — Approve or hide feedback
const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'hidden'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status, reviewedBy: req.admin.id },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ error: 'Feedback not found.' });
    return res.json({ message: `Feedback ${status} successfully.`, feedback });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update feedback status.' });
  }
};

// ─── DELETE /api/feedback/:id ────────────────────────────────────────────────
// Admin only — Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found.' });
    return res.json({ message: 'Feedback deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete feedback.' });
  }
};

module.exports = {
  getApprovedFeedback,
  getAllFeedback,
  submitFeedback,
  updateFeedbackStatus,
  deleteFeedback,
};
