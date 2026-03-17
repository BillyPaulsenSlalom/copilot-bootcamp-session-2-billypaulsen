const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');
const { sendError, sendSuccess } = require('./apiResponse');
const { mapTaskRow } = require('./taskMapper');
const { validateCreateTask, validateUpdateTask } = require('./taskValidation');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    due_date TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const createTaskStmt = db.prepare(
  `
    INSERT INTO tasks (title, due_date, completed)
    VALUES (?, ?, 0)
  `
);

const getTaskByIdStmt = db.prepare(
  `
    SELECT id, title, due_date, completed, created_at, updated_at
    FROM tasks
    WHERE id = ?
  `
);

console.log('In-memory database initialized for tasks API');

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Tasks backend server is running' });
});

// API Routes
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = db
      .prepare(
        `
          SELECT id, title, due_date, completed, created_at, updated_at
          FROM tasks
          ORDER BY created_at DESC, id DESC
        `
      )
      .all()
      .map(mapTaskRow);
    return sendSuccess(res, 200, tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return sendError(res, 500, 'INTERNAL_ERROR', 'Failed to fetch tasks.');
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const payload = req.body || {};
    const validation = validateCreateTask(payload);

    if (!validation.isValid) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Task payload is invalid.',
        validation.details
      );
    }

    const result = createTaskStmt.run(payload.title.trim(), payload.dueDate ?? null);
    const id = result.lastInsertRowid;
    const newTask = mapTaskRow(getTaskByIdStmt.get(id));

    return sendSuccess(res, 201, newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return sendError(res, 500, 'INTERNAL_ERROR', 'Failed to create task.');
  }
});

app.patch('/api/tasks/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const payload = req.body || {};

    if (Number.isNaN(id)) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Task id must be a valid number.', [
        { field: 'id', message: 'Task id must be numeric.' },
      ]);
    }

    const validation = validateUpdateTask(payload);
    if (!validation.isValid) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Task payload is invalid.',
        validation.details
      );
    }

    const existingTask = getTaskByIdStmt.get(id);
    if (!existingTask) {
      return sendError(res, 404, 'NOT_FOUND', 'Task not found.', [
        { field: 'id', message: 'No task exists for the provided id.' },
      ]);
    }

    const nextTitle = payload.title !== undefined ? payload.title.trim() : existingTask.title;
    const nextDueDate = payload.dueDate !== undefined ? payload.dueDate : existingTask.due_date;
    const nextCompleted =
      payload.completed !== undefined ? Number(payload.completed) : Number(existingTask.completed);

    db.prepare(
      `
        UPDATE tasks
        SET title = ?, due_date = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
    ).run(nextTitle, nextDueDate, nextCompleted, id);

    const updatedTask = mapTaskRow(getTaskByIdStmt.get(id));
    return sendSuccess(res, 200, updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return sendError(res, 500, 'INTERNAL_ERROR', 'Failed to update task.');
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Task id must be a valid number.', [
        { field: 'id', message: 'Task id must be numeric.' },
      ]);
    }

    const existingTask = getTaskByIdStmt.get(id);
    if (!existingTask) {
      return sendError(res, 404, 'NOT_FOUND', 'Task not found.', [
        { field: 'id', message: 'No task exists for the provided id.' },
      ]);
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return sendSuccess(res, 200, { id });
  } catch (error) {
    console.error('Error deleting task:', error);
    return sendError(res, 500, 'INTERNAL_ERROR', 'Failed to delete task.');
  }
});

module.exports = { app, db };