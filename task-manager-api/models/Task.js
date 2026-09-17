// ============================================================
// Task Model — Mongoose Schema & Validation
// ============================================================

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '"{VALUE}" is not a valid priority. Use low, medium, or high.',
    },
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ── Pre-save Hook ──────────────────────────────────────────────
// Automatically trims whitespace from the title before saving.
taskSchema.pre('save', function () {
  if (this.title) {
    this.title = this.title.trim();
  }
});

module.exports = mongoose.model('Task', taskSchema);
