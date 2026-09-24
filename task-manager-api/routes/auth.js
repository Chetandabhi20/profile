// ============================================================
// Authentication Routes — Register / Login / Me (Practical 7)
// ============================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validate');

const router = express.Router();

// ── POST /auth/register — Create a new user ─────────────────
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'A user with this email already exists.',
      });
    }

    // Hash the password before saving (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with hashed password
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /auth/login — Authenticate user and return JWT ─────
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password.',
      });
    }

    // Compare plain password with hashed password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password.',
      });
    }

    // Sign JWT token with user ID payload and 1 hour expiry
    // JWT_SECRET comes from .env — NEVER hardcoded
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /auth/me — Return logged-in user details ────────────
// (Supplementary Problem #1)
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    // req.user.id was set by the auth middleware from the decoded JWT
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
