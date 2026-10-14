// ============================================================
// Practical 5 + 6 + 7 — Task Management RESTful API
// Express.js | Mongoose ODM | MongoDB Atlas | CORS enabled
// + JWT Authentication | Input Validation | Middleware Pipeline
// ============================================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');               // ← Practical 6: CORS
const connectDB = require('./config/db');
const Task = require('./models/Task');

// ── Practical 7 Imports ─────────────────────────────────────
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const { validateTask } = require('./middleware/validate');
const cache = require('./utils/cache');

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

// 3. Request Logging Middleware (Global)
//    Logs HTTP method, URL, and ISO timestamp for every request.
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// 4. Content-Type Validation Middleware (Global — POST/PUT only)
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

// =============================================================
// AUTH ROUTES (public — no token required)
// =============================================================
app.use('/auth', authRoutes);

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
// CRUD ROUTE HANDLERS (Practical 7: All protected by authMiddleware)
// =============================================================

// GET /tasks — Retrieve all tasks (🔒 Protected + ⚡ Cached)
app.get('/tasks', authMiddleware, async (req, res, next) => {
  try {
    // Check cache first
    const cachedTasks = cache.get('all_tasks');
    if (cachedTasks) {
      return res.status(200).json({
        success: true,
        count: cachedTasks.length,
        data: cachedTasks,
        cached: true
      });
    }

    const tasks = await Task.find().sort({ createdAt: -1 });
    
    // Store in cache
    cache.set('all_tasks', tasks);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
      cached: false
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id — Retrieve a single task by ID (🔒 Protected + ⚡ Cached)
app.get('/tasks/:id', authMiddleware, validateObjectId, async (req, res, next) => {
  try {
    const cacheKey = `task_${req.params.id}`;
    const cachedTask = cache.get(cacheKey);
    
    if (cachedTask) {
      return res.status(200).json({
        success: true,
        data: cachedTask,
        cached: true
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${req.params.id} not found.`,
      });
    }

    cache.set(cacheKey, task);

    res.status(200).json({
      success: true,
      data: task,
      cached: false
    });
  } catch (err) {
    next(err);
  }
});

// POST /tasks — Create a new task (🔒 Protected + ✅ Validated)
app.post('/tasks', authMiddleware, validateTask, async (req, res, next) => {
  try {
    const newTask = await Task.create(req.body);
    
    // Invalidate cache
    cache.del('all_tasks');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id — Update an existing task (🔒 Protected + ✅ Validated)
app.put('/tasks/:id', authMiddleware, validateObjectId, validateTask, async (req, res, next) => {
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

    // Invalidate caches
    cache.del('all_tasks');
    cache.del(`task_${req.params.id}`);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id — Delete a task (🔒 Protected)
app.delete('/tasks/:id', authMiddleware, validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${req.params.id} not found.`,
      });
    }

    // Invalidate caches
    cache.del('all_tasks');
    cache.del(`task_${req.params.id}`);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
});

// GET /debug/cache — Cache stats (Supplementary Problem)
app.get('/debug/cache', (req, res) => {
  res.status(200).json({
    success: true,
    stats: cache.stats,
    keys: cache.keys()
  });
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

  // ── Duplicate Key Error (e.g., duplicate email) ──────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: 'Conflict',
      message: `A record with this ${field} already exists.`,
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
  console.log('   POST   /auth/register   (public)');
  console.log('   POST   /auth/login      (public)');
  console.log('   GET    /auth/me         (🔒 protected)');
  console.log('   GET    /tasks           (🔒 protected)');
  console.log('   GET    /tasks/:id       (🔒 protected)');
  console.log('   POST   /tasks           (🔒 protected + validated)');
  console.log('   PUT    /tasks/:id       (🔒 protected + validated)');
  console.log('   DELETE /tasks/:id       (🔒 protected)');
});
