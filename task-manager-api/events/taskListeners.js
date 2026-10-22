// ============================================================
// Practical 10 — Event Listeners (Background Notification System)
// Registered once at server startup; handles all task events
// ============================================================

const taskEvents = require('./taskEvents');

// ── Core: task-created listener (Async Handler — 5 marks) ────
// The 2-second setTimeout simulates a slow notification service
// (e.g., sending an email) to make async behavior visible.
taskEvents.on('task-created', (task) => {
  setTimeout(() => {
    console.log('────────────────────────────────────────');
    console.log(`[Notification] 📬 New Task Created`);
    console.log(`  Title     : ${task.title}`);
    console.log(`  Priority  : ${task.priority || 'medium'}`);
    console.log(`  Assigned  : ${task.assignedUser || 'Unassigned'}`);
    console.log(`  Timestamp : ${new Date().toISOString()}`);
    console.log('────────────────────────────────────────');
  }, 2000); // 2-second delay proves async nature
});

// ── Supplementary: task-deleted listener ──────────────────────
taskEvents.on('task-deleted', (task) => {
  setTimeout(() => {
    console.log('────────────────────────────────────────');
    console.log(`[Notification] 🗑️  Task Deleted`);
    console.log(`  Title     : ${task.title}`);
    console.log(`  Deleted at: ${new Date().toISOString()}`);
    console.log('────────────────────────────────────────');
  }, 1000);
});

// ── Supplementary: error event listener ──────────────────────
// Prevents unhandled 'error' events from crashing the server.
taskEvents.on('error', (err) => {
  console.error('────────────────────────────────────────');
  console.error(`[EventError] ❌ ${err.message}`);
  console.error(`  Stack: ${err.stack}`);
  console.error('────────────────────────────────────────');
});

console.log('✔  Task event listeners registered');
