const Enquiry = require('../models/Enquiry');
const { sendCustomerConfirmation, sendAdminNotification } = require('../utils/emailService');

// ─── POST /api/enquiries ─────────────────────────────────────────────────────
// Public — Submit a new enquiry (FR1, FR2, FR3, FR4)
const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, companyName, country, jobTitle, jobDetails } = req.body;

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      companyName,
      country,
      jobTitle,
      jobDetails,
    });

    // Attempt to send emails; do not block the response if they fail
    let emailSent = false;
    try {
      await sendCustomerConfirmation(enquiry);
      await sendAdminNotification(enquiry);
      emailSent = true;
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    // Update emailSent flag in DB
    enquiry.emailSent = emailSent;
    await enquiry.save();

    return res.status(201).json({
      message: 'Enquiry submitted successfully. We will be in touch shortly.',
      enquiryId: enquiry._id,
    });
  } catch (err) {
    console.error('submitEnquiry error:', err.message);
    return res.status(500).json({ error: 'Failed to submit enquiry. Please try again.' });
  }
};

// ─── GET /api/enquiries ──────────────────────────────────────────────────────
// Admin only — Get all enquiries with total count (FR6)
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ submittedAt: -1 });
    return res.json({
      total: enquiries.length,
      enquiries,
    });
  } catch (err) {
    console.error('getAllEnquiries error:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve enquiries.' });
  }
};

// ─── GET /api/enquiries/:id ──────────────────────────────────────────────────
// Admin only — Get a single enquiry by ID (FR6)
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }
    return res.json(enquiry);
  } catch (err) {
    console.error('getEnquiryById error:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve enquiry.' });
  }
};

// ─── DELETE /api/enquiries/:id ───────────────────────────────────────────────
// Admin only — Delete an enquiry
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }
    return res.json({ message: 'Enquiry deleted successfully.' });
  } catch (err) {
    console.error('deleteEnquiry error:', err.message);
    return res.status(500).json({ error: 'Failed to delete enquiry.' });
  }
};

module.exports = { submitEnquiry, getAllEnquiries, getEnquiryById, deleteEnquiry };
