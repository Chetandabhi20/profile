# Chetan Dabhi — Portfolio & Full-Stack Task Manager

[![CI Pipeline](https://github.com/Chetandabhi20/profile/actions/workflows/ci.yml/badge.svg)](https://github.com/Chetandabhi20/profile/actions/workflows/ci.yml)

A full-stack, containerized web application featuring a hacker/terminal-themed React portfolio frontend connected to a robust Node.js/Express RESTful API with MongoDB, JWT Authentication, in-memory caching, event-driven async notifications, Docker containerization, and an automated CI/CD pipeline using **GitHub Actions**.

---

## 🚀 Practical 12: CI/CD Pipeline with GitHub Actions

### Objective
Automate dependency installation and end-to-end integration testing on every `git push` and `pull_request` targeting the `main` branch.

### Pipeline Architecture
```
git push origin main / Pull Request
        |
        v
  GitHub Actions Trigger (on: push, pull_request)
        |
        v
  Job: build-and-test (ubuntu-latest)
   ├── Step 1: Checkout repository (actions/checkout@v4)
   ├── Step 2: Setup Node.js 18 with npm cache (actions/setup-node@v4)
   ├── Step 3: Install dependencies (npm install)
   ├── Step 4: Run automated tests (npm test via Jest + Supertest)
   └── Step 5: Report pass / fail status
        |
        v
  Status: Green checkmark (Pass) or Red X (Fail) on GitHub
```

### Automated Tests Overview
The automated test suite (`task-manager-api/tests/api.test.js`) verifies:
1. **Health Check Probe (`GET /health`)**: Verifies the API server mounts correctly and responds with HTTP `200` and `{ status: "OK" }`.
2. **Authentication Protection (`GET /tasks`)**: Ensures unauthenticated requests are rejected with HTTP `401 Unauthorized`.
3. **Protected CRUD Handling (`GET /tasks`)**: Verifies authorized requests with signed JWT bearer tokens return HTTP `200` and task data.
4. **Cache Metrics Probe (`GET /debug/cache`)**: Tests caching infrastructure endpoint returning HTTP `200`.
5. **404 Route Handling (`GET /unknown-route`)**: Ensures non-existent routes return HTTP `404 Not Found`.

---

## 🛠️ Local Testing & Execution

### Running Backend Tests Locally
```bash
# Navigate to the backend directory
cd task-manager-api

# Run test suite with Jest
npm test
```

Or from the workspace root:
```bash
npm test
```

### Starting the Full Stack Locally (Docker Compose)
```bash
# Start all services (frontend, backend, mongodb) in detached mode
docker compose up -d --build

# View logs
docker compose logs -f
```

---

## 📂 Project Structure
```
profile/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI workflow
├── src/                           # React frontend (Vite)
├── task-manager-api/              # Express backend REST API
│   ├── config/                    # MongoDB connection
│   ├── events/                    # EventEmitter async notification listeners
│   ├── middleware/                # JWT auth and validation middleware
│   ├── models/                    # Mongoose schemas (Task, User)
│   ├── routes/                    # API routes (auth, tasks)
│   ├── tests/                     # Automated test suite (Jest + Supertest)
│   │   └── api.test.js
│   ├── utils/                     # Cache utilities
│   ├── server.js                  # Express app entry
│   └── package.json
├── docker-compose.yml             # Multi-container Docker orchestration
├── Dockerfile                     # Multi-stage frontend Docker build
├── .antigravity_map.yaml          # Project mind map protocol
└── README.md
```

---

## 🧪 Demonstration of CI Pipeline Failure & Resolution
1. **Baseline**: Tests pass locally and on GitHub Actions with a **Green checkmark**.
2. **Simulated Failure**: In `task-manager-api/tests/api.test.js`, alter an expectation (e.g. changing `expect(res.statusCode).toBe(200)` to `toBe(500)`). Commit and push to observe a **Red X** and view the assertion failure log in GitHub Actions.
3. **Restoration**: Correct the expectation back to `200`, commit, and push. The pipeline automatically re-runs and returns to **Green**.
