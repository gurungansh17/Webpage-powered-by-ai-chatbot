const Solution = require('../models/Solution');

// ─── GET /api/solutions ──────────────────────────────────────────────────────
// Public — Get all solutions (FR9)
const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find().sort({ createdAt: -1 });
    return res.json(solutions);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve solutions.' });
  }
};

// ─── GET /api/solutions/:id ──────────────────────────────────────────────────
const getSolutionById = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ error: 'Solution not found.' });
    return res.json(solution);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve solution.' });
  }
};

// ─── POST /api/solutions ─────────────────────────────────────────────────────
// Admin only — Create a solution (FR7)
const createSolution = async (req, res) => {
  try {
    const { title, description, iconOrImage } = req.body;
    const solution = await Solution.create({
      title,
      description,
      iconOrImage: iconOrImage || null,
      createdBy: req.admin.id,
    });
    return res.status(201).json({ message: 'Solution created successfully.', solution });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create solution.' });
  }
};

// ─── PUT /api/solutions/:id ──────────────────────────────────────────────────
// Admin only — Update a solution (FR7)
const updateSolution = async (req, res) => {
  try {
    const { title, description, iconOrImage } = req.body;
    const solution = await Solution.findByIdAndUpdate(
      req.params.id,
      { title, description, iconOrImage, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!solution) return res.status(404).json({ error: 'Solution not found.' });
    return res.json({ message: 'Solution updated successfully.', solution });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update solution.' });
  }
};

// ─── DELETE /api/solutions/:id ───────────────────────────────────────────────
const deleteSolution = async (req, res) => {
  try {
    const solution = await Solution.findByIdAndDelete(req.params.id);
    if (!solution) return res.status(404).json({ error: 'Solution not found.' });
    return res.json({ message: 'Solution deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete solution.' });
  }
};

module.exports = { getSolutions, getSolutionById, createSolution, updateSolution, deleteSolution };
