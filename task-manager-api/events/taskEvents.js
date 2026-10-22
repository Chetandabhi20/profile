// ============================================================
// Practical 10 — EventEmitter Singleton
// Node.js built-in events module (no external dependencies)
// ============================================================

const EventEmitter = require('events');

class TaskEvents extends EventEmitter {}

module.exports = new TaskEvents();
