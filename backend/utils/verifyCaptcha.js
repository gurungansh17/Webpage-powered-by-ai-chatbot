const axios = require('axios');

/**
 * Verifies a Google reCAPTCHA v2 token against the secret key (FR5)
 * Returns true if valid, false otherwise
 */
const verifyCaptcha = async (token) => {
  if (!token) return false;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );
    return response.data.success === true;
  } catch (err) {
    console.error('reCAPTCHA verification error:', err.message);
    return false;
  }
};

module.exports = verifyCaptcha;
