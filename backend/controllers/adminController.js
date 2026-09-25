const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const verifyCaptcha = require('../utils/verifyCaptcha');

// Helper — generate JWT
const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── POST /api/admin/login ───────────────────────────────────────────────────
// Public — Admin login with CAPTCHA verification (FR5)
const loginAdmin = async (req, res) => {
  try {
    const { username, password, captchaToken } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Verify reCAPTCHA before checking credentials (FR5)
    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
      return res.status(400).json({ error: 'CAPTCHA verification failed. Please try again.' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const passwordMatch = await admin.matchPassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(admin._id, admin.username);

    return res.json({
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error('loginAdmin error:', err.message);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// ─── GET /api/admin/me ───────────────────────────────────────────────────────
// Admin only — Get current logged-in admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });
    return res.json(admin);
  } catch (err) {
    console.error('getAdminProfile error:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve admin profile.' });
  }
};

// ─── POST /api/admin/seed ────────────────────────────────────────────────────
// One-time use — Create the initial admin account (disable after use in production)
const seedAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ username: 'admin' });
    if (existing) {
      return res.status(400).json({ error: 'Admin already exists.' });
    }

    const admin = await Admin.create({
      username: 'admin',
      passwordHash: 'Admin@123456', // This gets hashed by the pre-save hook
      email: process.env.ADMIN_EMAIL || 'admin@ai-solutions.com',
    });

    return res.status(201).json({
      message: 'Admin account created. Please change your password.',
      admin,
    });
  } catch (err) {
    console.error('seedAdmin error:', err.message);
    return res.status(500).json({ error: 'Failed to create admin.' });
  }
};

module.exports = { loginAdmin, getAdminProfile, seedAdmin };
