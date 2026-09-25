const CaseStudy = require('../models/CaseStudy');

// ─── GET /api/casestudies ────────────────────────────────────────────────────
// Public — Get all case studies (FR9)
const getCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find().sort({ createdAt: -1 });
    return res.json(caseStudies);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve case studies.' });
  }
};

// ─── GET /api/casestudies/:id ────────────────────────────────────────────────
const getCaseStudyById = async (req, res) => {
  try {
    const cs = await CaseStudy.findById(req.params.id);
    if (!cs) return res.status(404).json({ error: 'Case study not found.' });
    return res.json(cs);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve case study.' });
  }
};

// ─── POST /api/casestudies ───────────────────────────────────────────────────
// Admin only — Create a case study (FR7)
const createCaseStudy = async (req, res) => {
  try {
    const { title, industry, summary, outcome } = req.body;
    const cs = await CaseStudy.create({
      title,
      industry,
      summary,
      outcome: outcome || null,
      createdBy: req.admin.id,
    });
    return res.status(201).json({ message: 'Case study created successfully.', caseStudy: cs });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create case study.' });
  }
};

// ─── PUT /api/casestudies/:id ────────────────────────────────────────────────
// Admin only — Update a case study (FR7)
const updateCaseStudy = async (req, res) => {
  try {
    const { title, industry, summary, outcome } = req.body;
    const cs = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      { title, industry, summary, outcome, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!cs) return res.status(404).json({ error: 'Case study not found.' });
    return res.json({ message: 'Case study updated successfully.', caseStudy: cs });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update case study.' });
  }
};

// ─── DELETE /api/casestudies/:id ─────────────────────────────────────────────
const deleteCaseStudy = async (req, res) => {
  try {
    const cs = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!cs) return res.status(404).json({ error: 'Case study not found.' });
    return res.json({ message: 'Case study deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete case study.' });
  }
};

module.exports = { getCaseStudies, getCaseStudyById, createCaseStudy, updateCaseStudy, deleteCaseStudy };
