// ============================================================
// Authentication Middleware — JWT Verification (Practical 7)
// ============================================================

const jwt = require('jsonwebtoken');

/**
 * Verifies the JWT token from the Authorization header.
 * Sets req.user = { id } on success, returns 401 on failure.
 *
 * Expected header format: Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
  // 1. Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. No token provided. Send Authorization: Bearer <token>',
    });
  }

  const token = authHeader.split(' ')[1];

  // 2. Verify the token (wrapped in try/catch to prevent server crash)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, iat, exp }
    next();
  } catch (err) {
    // Handle specific JWT errors for descriptive messages
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired. Please login again.',
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token. Authentication failed.',
      });
    }

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token verification failed.',
    });
  }
}

module.exports = authMiddleware;
