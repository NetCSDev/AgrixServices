const jwt = require('jsonwebtoken');
const { config } = require('../config/environment');

/**
 * Middleware to protect routes — verifies the Bearer JWT from the Authorization header.
 * On success, attaches decoded payload to req.user ({ id, mobile, iat, exp }).
 */
const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }

  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Token invalid or expired' });
  }
};

module.exports = { protect };
