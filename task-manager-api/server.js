// ============================================================
// Practical 4 — Task Management RESTful API
// Express.js | In-Memory CRUD | Middleware Pipeline
// ============================================================

const express = require('express');
const app = express();
const PORT = 5000;

// ── In-Memory Data Store ─────────────────────────────────────
let tasks = [
  { id: 1, title: 'Learn Express.js', completed: false },
  { id: 2, title: 'Build REST API',   completed: false },
];
let nextId = 3;

// =============================================================
// MIDDLEWARE PIPELINE (order matters!)
// =============================================================

// 1. Parse incoming JSON bodies
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
// Validates that :id is a positive integer before the controller runs.
function validateTaskId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid task ID "${req.params.id}". ID must be a positive integer.`,
    });
  }
  // Attach parsed id so controllers don't need to parse again
  req.taskId = id;
  next();
}

// =============================================================
// CRUD ROUTE HANDLERS
// =============================================================

// GET /tasks — Retrieve all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// POST /tasks — Create a new task
app.post('/tasks', (req, res) => {
  const { title, completed } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Field "title" is required and must be a non-empty string.',
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: typeof completed === 'boolean' ? completed : false,
  };

  tasks.push(newTask);
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask,
  });
});

// PUT /tasks/:id — Update an existing task
app.put('/tasks/:id', validateTaskId, (req, res) => {
  const task = tasks.find((t) => t.id === req.taskId);

  if (!task) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Task with ID ${req.taskId} not found.`,
    });
  }

  const { title, completed } = req.body;
  if (title !== undefined) task.title = String(title).trim();
  if (completed !== undefined) task.completed = Boolean(completed);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

// DELETE /tasks/:id — Delete a task
app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.taskId);

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Task with ID ${req.taskId} not found.`,
    });
  }

  const deleted = tasks.splice(index, 1)[0];
  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: deleted,
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
  console.log('   POST   /tasks');
  console.log('   PUT    /tasks/:id');
  console.log('   DELETE /tasks/:id');
});
