// ============================================================
// Practical 6 + 7 — Centralized API Service Layer
// Single source of truth for the backend base URL
// + JWT token management and auth endpoints
// ============================================================

const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : `http://${window.location.hostname}:5000`

// ── Token Management (localStorage) ─────────────────────────
// Supplementary Problem #3: Token stored in localStorage,
// cleared on logout to implement logout mechanism.

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

export function isAuthenticated() {
  return !!getToken()
}

// ── Helper — build Authorization header ─────────────────────
function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── Helper — unwrap the { success, data } envelope ──────────
// Supplementary Problem #2: 401 detection — clears token and
// dispatches a custom event so the frontend can redirect to login.
async function handleResponse(res) {
  const json = await res.json()

  if (!res.ok) {
    // If token is invalid/expired, clear it and notify the app
    if (res.status === 401) {
      clearToken()
      window.dispatchEvent(new Event('auth:expired'))
    }

    const msg =
      json.message ||
      (json.messages && json.messages.join(', ')) ||
      json.error ||
      `HTTP ${res.status}: ${res.statusText}`
    throw new Error(msg)
  }

  return json.data !== undefined ? json.data : json
}

// =============================================================
// AUTH ENDPOINTS (public — no token needed)
// =============================================================

// ── POST /auth/register — Register a new user ───────────────
export async function register({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return handleResponse(res)
}

// ── POST /auth/login — Login and receive JWT ────────────────
export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json()

  if (!res.ok) {
    const msg =
      json.message ||
      (json.messages && json.messages.join(', ')) ||
      json.error ||
      `HTTP ${res.status}: ${res.statusText}`
    throw new Error(msg)
  }

  // Store the token on successful login
  if (json.token) {
    setToken(json.token)
  }

  return json.data
}

// ── GET /auth/me — Get current user details ─────────────────
export async function getMe() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res)
}

// =============================================================
// TASK ENDPOINTS (🔒 protected — token required)
// =============================================================

// ── GET /tasks — Retrieve all tasks ─────────────────────────
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: { ...authHeaders() },
  })
  return handleResponse(res)
}

// ── POST /tasks — Create a new task ─────────────────────────
export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(task),
  })
  return handleResponse(res)
}

// ── PUT /tasks/:id — Update an existing task ────────────────
export async function updateTask(id, task) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(task),
  })
  return handleResponse(res)
}

// ── DELETE /tasks/:id — Delete a task ───────────────────────
export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  return handleResponse(res)
}
