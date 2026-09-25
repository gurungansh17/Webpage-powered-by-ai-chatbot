const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Sends a confirmation email to the customer after enquiry submission (FR2)
 */
const sendCustomerConfirmation = async (enquiry) => {
  const mailOptions = {
    from: `"AI-Solutions" <${process.env.EMAIL_USER}>`,
    to: enquiry.email,
    subject: 'We have received your enquiry – AI-Solutions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Thank you for contacting AI-Solutions</h2>
        <p>Dear ${enquiry.name},</p>
        <p>
          We have successfully received your enquiry and a member of our team will
          be in touch with you shortly.
        </p>
        <h3 style="color: #2c3e50;">Your submission summary:</h3>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding:6px; font-weight:bold;">Name</td><td>${enquiry.name}</td></tr>
          <tr><td style="padding:6px; font-weight:bold;">Company</td><td>${enquiry.companyName}</td></tr>
          <tr><td style="padding:6px; font-weight:bold;">Job Title</td><td>${enquiry.jobTitle}</td></tr>
          <tr><td style="padding:6px; font-weight:bold;">Country</td><td>${enquiry.country}</td></tr>
        </table>
        <p style="margin-top:20px; color:#888; font-size:12px;">
          AI-Solutions | Sunderland, UK
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Sends a notification email to the admin when a new enquiry is submitted (FR3)
 */
const sendAdminNotification = async (enquiry) => {
  const mailOptions = {
    from: `"AI-Solutions System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Enquiry Received from ${enquiry.name} – AI-Solutions`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">New Customer Enquiry</h2>
        <p>A new enquiry has been submitted via the Contact Us form.</p>
        <table style="width:100%; border-collapse: collapse; border: 1px solid #ddd;">
          <tr style="background:#f4f4f4;"><td style="padding:8px; font-weight:bold;">Name</td><td style="padding:8px;">${enquiry.name}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Email</td><td style="padding:8px;">${enquiry.email}</td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:8px; font-weight:bold;">Phone</td><td style="padding:8px;">${enquiry.phone}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Company</td><td style="padding:8px;">${enquiry.companyName}</td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:8px; font-weight:bold;">Country</td><td style="padding:8px;">${enquiry.country}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Job Title</td><td style="padding:8px;">${enquiry.jobTitle}</td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:8px; font-weight:bold;">Job Details</td><td style="padding:8px;">${enquiry.jobDetails}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Submitted At</td><td style="padding:8px;">${new Date(enquiry.submittedAt).toLocaleString()}</td></tr>
        </table>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendCustomerConfirmation, sendAdminNotification };
