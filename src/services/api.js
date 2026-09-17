// ============================================================
// Practical 6 — Centralized API Service Layer
// Single source of truth for the backend base URL
// ============================================================

const BASE_URL = 'http://localhost:5000'

// ── Helper — unwrap the { success, data } envelope ──────────
async function handleResponse(res) {
  const json = await res.json()
  if (!res.ok) {
    // Use the backend's error message if available
    const msg =
      json.message ||
      (json.messages && json.messages.join(', ')) ||
      json.error ||
      `HTTP ${res.status}: ${res.statusText}`
    throw new Error(msg)
  }
  return json.data
}

// ── GET /tasks — Retrieve all tasks ─────────────────────────
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`)
  return handleResponse(res)
}

// ── POST /tasks — Create a new task ─────────────────────────
export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  return handleResponse(res)
}

// ── PUT /tasks/:id — Update an existing task ────────────────
export async function updateTask(id, task) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  return handleResponse(res)
}

// ── DELETE /tasks/:id — Delete a task ───────────────────────
export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(res)
}
