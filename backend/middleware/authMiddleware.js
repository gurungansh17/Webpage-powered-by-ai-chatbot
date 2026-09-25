const jwt = require('jsonwebtoken');

/**
 * Middleware to protect admin routes using JWT (NFR3)
 * Attaches decoded admin payload to req.admin on success
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorised. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorised. Invalid or expired token.' });
  }
};

module.exports = protect;
