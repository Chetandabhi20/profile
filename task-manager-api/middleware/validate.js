// ============================================================
// Input Validation Middleware (Practical 7)
// Server-side validation — rejects malformed requests before
// they reach the database layer.
// ============================================================

/**
 * Validate registration input.
 * Rules enforced:
 *   1. name    — required (non-empty string)
 *   2. email   — required + valid email format
 *   3. password — required + minimum 6 characters
 */
function validateRegister(req, res, next) {
  const errors = [];
  const { name, email, password } = req.body;

  // Rule 1: Name is required
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required and must be a non-empty string.');
  }

  // Rule 2: Email must be valid format
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email must be a valid email address (e.g., user@example.com).');
  }

  // Rule 3: Password must be at least 6 characters
  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors,
    });
  }

  next();
}

/**
 * Validate login input.
 * Rules enforced:
 *   1. email    — required
 *   2. password — required
 */
function validateLogin(req, res, next) {
  const errors = [];
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required.');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors,
    });
  }

  next();
}

/**
 * Validate task input (for POST / PUT).
 * Rules enforced:
 *   1. title    — required (non-empty string) for POST
 *   2. priority — must be low/medium/high if provided
 */
function validateTask(req, res, next) {
  const errors = [];
  const { title, priority } = req.body;

  // For POST requests, title is mandatory
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push('Task title is required and must be a non-empty string.');
    }
  }

  // If priority is provided, it must be one of the allowed values
  if (priority !== undefined) {
    const allowed = ['low', 'medium', 'high'];
    if (!allowed.includes(priority)) {
      errors.push(`Priority must be one of: ${allowed.join(', ')}. Received: "${priority}".`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors,
    });
  }

  next();
}

module.exports = { validateRegister, validateLogin, validateTask };
