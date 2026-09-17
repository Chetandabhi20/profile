// ============================================================
// Practical 5 + 6 — Task Management RESTful API (MongoDB Edition)
// Express.js | Mongoose ODM | MongoDB Atlas | CORS enabled
// ============================================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');               // ← Practical 6: CORS
const connectDB = require('./config/db');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ──────────────────────────────────────
connectDB();

// =============================================================
// MIDDLEWARE PIPELINE (order matters!)
// =============================================================

// 1. Enable CORS — allows React dev server (localhost:5173) to call this API
app.use(cors());

// 2. Parse incoming JSON bodies
app.use(express.json());

// 2. Request Logging Middleware (Global)
//    Logs HTTP method, URL, and ISO timestamp for every request.
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// 3. Content-Type Validation Middleware (Global — POST/PUT only)
//    Rejects POST and PUT requests that are missing
//    the Content-Type: application/json header.
app.use((req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') &&
      !req.is('application/json')) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Content-Type header must be application/json for POST/PUT requests',
    });
  }
  next();
});

// ── Route-Specific Middleware ────────────────────────────────
// Validates that :id is a valid MongoDB ObjectId.
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid task ID "${req.params.id}". Must be a valid MongoDB ObjectId.`,
    });
  }
  next();
}

// =============================================================
// CRUD ROUTE HANDLERS
// =============================================================

// GET /tasks — Retrieve all tasks
app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id — Retrieve a single task by ID
app.get('/tasks/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${req.params.id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
});

// POST /tasks — Create a new task
app.post('/tasks', async (req, res, next) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id — Update an existing task
app.put('/tasks/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${req.params.id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id — Delete a task
app.delete('/tasks/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${req.params.id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
});

// =============================================================
// ERROR-HANDLING MIDDLEWARE (must be LAST in the pipeline)
// =============================================================

// 404 Handler — catches requests to undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} does not exist on this server.`,
  });
});

// Global Error Handler — catches any unhandled errors passed via next(err)
// Must have exactly 4 parameters so Express recognises it as an error handler.
app.use((err, req, res, next) => {
  // ── Mongoose Validation Error ────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      messages,
    });
  }

  // ── Mongoose Cast Error (invalid ObjectId in body) ───────────
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid value "${err.value}" for field "${err.path}".`,
    });
  }

  // ── Generic Server Error ─────────────────────────────────────
  console.error('[ERROR]', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server.',
    // NOTE: We intentionally do NOT send err.stack to the client
    // to avoid leaking sensitive implementation details.
  });
});

// =============================================================
// START SERVER
// =============================================================
app.listen(PORT, () => {
  console.log(`✔  Task Manager API running → http://localhost:${PORT}`);
  console.log('   Endpoints:');
  console.log('   GET    /tasks');
  console.log('   GET    /tasks/:id');
  console.log('   POST   /tasks');
  console.log('   PUT    /tasks/:id');
  console.log('   DELETE /tasks/:id');
});
