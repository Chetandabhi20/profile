# Practical-4: Building a RESTful API with Node.js and Express

**Aim:** To design and implement a RESTful backend server with complete CRUD endpoints using Express middleware pipeline.

**Step-1:** Initialize a new Node project and install Express
```bash
mkdir task-manager-api && cd task-manager-api
npm init -y
npm install express
```

**Step-2,3,4,5:** Create server.js, set up basic Express app, add request logging middleware, implement CRUD routes (in-memory), and global error handling.
```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Step-3: Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Step-4: CRUD Routes using an in-memory array
let tasks = [];
let currentId = 1;

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = { id: currentId++, ...req.body };
    tasks.push(task);
    res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...req.body };
        res.json(tasks[index]);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.json({ message: 'Task deleted' });
});

// Step-5: Global error handling middleware (must be the last middleware)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
```

**Step-6:** Test all 4 endpoints using Postman or Thunder Client, verifying correct status codes.

> **[SCREENSHOT INSTRUCTIONS for Word File]**
> *Screenshot 1:* Postman showing a successful `POST /tasks` request and its JSON response.
> *Screenshot 2:* Postman showing a successful `GET /tasks` request.
> *Screenshot 3:* Postman showing a successful `PUT /tasks/1` request.
> *Screenshot 4:* Postman showing a successful `DELETE /tasks/1` request.

---

# Practical-5: MongoDB Integration and Schema Design with Mongoose

**Aim:** To connect a MongoDB database to an Express server and enforce data validation through Mongoose schema.

**Step-1:** Install Mongoose and create a .env file for the connection string
```bash
npm install mongoose dotenv
```
*(In your `.env` file)*
```env
MONGO_URI=mongodb://localhost:27017/taskmanager
```

**Step-3:** Define the Task schema and model in a separate models/Task.js file.
```javascript
// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
```

**Step-2,4,5:** Connect to MongoDB inside server.js, replace the in-memory array with Mongoose methods, and wrap routes in try/catch.
```javascript
// Add to server.js
const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('./models/Task');

mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log('MongoDB connected'))
 .catch((err) => console.error(err));

// Updated Routes (Step-4 & 5)
app.get('/tasks', async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) { next(err); }
});

app.post('/tasks', async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (err) { next(err); }
});

app.put('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err) { next(err); }
});

app.delete('/tasks/:id', async (req, res, next) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) { next(err); }
});
```

**Step-6:** Test all 4 endpoints in Postman; confirm data persists in MongoDB.

> **[SCREENSHOT INSTRUCTIONS for Word File]**
> *Screenshot 1:* Postman showing a validation error when creating a task without a `title` (to prove schema works).
> *Screenshot 2:* Postman showing a successful `POST` request with MongoDB object IDs (like `_id: "64a2..."`).
> *Screenshot 3:* MongoDB Compass or terminal showing the saved task inside the database.

---

# Practical-6: Full Stack Integration React + Node + MongoDB

**Aim:** To wire the React frontend to the Node/Express/MongoDB backend into a fully functional full-stack application.

**Step-1:** Install and configure CORS on the Express backend.
```bash
npm install cors
```
```javascript
// Add to server.js
const cors = require('cors');
app.use(cors());
```

**Step-2,3,4,5,6:** In React, create a central api.js file and integrate it into your UI component (e.g., Projects.jsx) to perform CRUD operations.
```javascript
// src/api.js
const BASE_URL = 'http://localhost:5000';

export const getTasks = () => fetch(`${BASE_URL}/tasks`).then(res => res.json());

export const createTask = (task) => fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
}).then(res => res.json());

export const updateTask = (id, task) => fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
}).then(res => res.json());

export const deleteTask = (id) => fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
}).then(res => res.json());
```

```javascript
// Inside your React component (e.g., Tasks or Projects)
import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';

const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    fetchTasks();
}, []);

const fetchTasks = () => {
    setLoading(true);
    getTasks()
        .then(data => setTasks(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
};

const handleCreateTask = async (title) => {
    await createTask({ title });
    fetchTasks(); // Re-fetch to sync state
};

const handleDeleteTask = async (id) => {
    await deleteTask(id);
    fetchTasks(); // Re-fetch to sync state
};
```

**Step-7:** Test the complete flow: create → view → update → delete.

> **[SCREENSHOT INSTRUCTIONS for Word File]**
> *Screenshot 1:* The React frontend displaying the list of tasks fetched from your backend.
> *Screenshot 2:* The React UI right after creating a new task, showing it added to the list.
> *Screenshot 3:* The Network tab in browser DevTools showing a successful API request (`fetch`) made to `localhost:5000`.

---

# Practical-7: Authentication and Middleware Pipeline

**Aim:** To implement JWT-based authentication and input validation as part of the Express middleware pipeline.

**Step-1:** Install required packages.
```bash
npm install bcryptjs jsonwebtoken
```

**Step-2:** Create a User schema with email and hashed password fields.
```javascript
// models/User.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
module.exports = mongoose.model('User', userSchema);
```

**Step-3,4:** Implement the register and login routes in server.js.
```javascript
// Add to server.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

app.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) { next(err); }
});

app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) { next(err); }
});
```

**Step-5,6,7:** Create an auth middleware that verifies the token, a validation middleware, and apply them.
```javascript
// Auth Middleware
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Validation Middleware
const validateTask = (req, res, next) => {
    if (!req.body.title) return res.status(400).json({ error: 'Title is required' });
    next();
};

// Apply middlewares to routes
app.use('/tasks', authMiddleware); // Protects all /tasks routes

// Apply input validation specifically to POST /tasks
app.post('/tasks', validateTask, async (req, res, next) => {
    // ... task creation logic ...
});
```

**Step-8:** Test the full flow in Postman.

> **[SCREENSHOT INSTRUCTIONS for Word File]**
> *Screenshot 1:* Postman showing successful `POST /register` with email and password.
> *Screenshot 2:* Postman showing successful `POST /login` and the server returning a JWT Token.
> *Screenshot 3:* Postman showing a `401 Unauthorized` error when trying to `GET /tasks` without passing the token.
> *Screenshot 4:* Postman showing a successful `GET /tasks` request where the JWT Token is provided in the `Authorization` header as a Bearer token.
