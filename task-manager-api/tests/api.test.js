// ============================================================
// Practical 12 — Automated API Test Suite (CI/CD Pipeline)
// Supertest + Jest for Task Manager Express API
// ============================================================

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const cache = require('../utils/cache');

describe('Practical 12 — Automated CI/CD Pipeline Tests', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'ci_test_secret_key_12345';
  let testToken;

  beforeAll(() => {
    // Set fallback test secret if undefined in CI environment
    process.env.JWT_SECRET = JWT_SECRET;

    // Generate valid test token for authenticated tests
    testToken = jwt.sign(
      { id: '60d0fe4f5311236168a109ca', email: 'ci-runner@github.actions' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterEach(() => {
    // Flush cache after each test run
    cache.flushAll();
  });

  // ── Primary Test 1: Health Check Endpoint ───────────────────
  describe('GET /health (CI Health Probe)', () => {
    test('GET /health returns 200 and OK status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  // ── Primary Test 2: Auth Protection on /tasks ────────────────
  describe('GET /tasks (Auth & Protection)', () => {
    test('GET /tasks returns 401 Unauthorized when no token is provided', async () => {
      const res = await request(app).get('/tasks');
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });

    test('GET /tasks returns 200 with valid JWT authorization header', async () => {
      // Seed cache so GET /tasks serves cached list without external MongoDB connection
      const sampleTasks = [
        {
          _id: '60d0fe4f5311236168a109cb',
          title: 'Implement CI/CD with GitHub Actions',
          description: 'Automate build, lint, and test stages',
          completed: false,
          priority: 'High',
        },
      ];
      cache.set('all_tasks', sampleTasks);

      const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].title).toBe('Implement CI/CD with GitHub Actions');
    });
  });

  // ── Supplementary Problem: Additional Endpoints ─────────────
  describe('GET /debug/cache (Supplementary Test)', () => {
    test('GET /debug/cache returns 200 with cache metrics', async () => {
      const res = await request(app).get('/debug/cache');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('stats');
      expect(res.body).toHaveProperty('keys');
    });
  });

  describe('Error Handling Middleware', () => {
    test('GET /undefined-route returns 404 Not Found JSON error', async () => {
      const res = await request(app).get('/non-existent-endpoint');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });
  });
});
