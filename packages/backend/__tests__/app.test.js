const request = require('supertest');
const { app, db } = require('../src/app');

beforeEach(() => {
  db.prepare('DELETE FROM tasks').run();
});

// Test helpers
const createTask = async (payload = { title: 'Temp Task to Update' }) => {
  const response = await request(app)
    .post('/api/tasks')
    .send(payload)
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('data.id');
  return response.body.data;
};

describe('API Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      await createTask({ title: 'Task A' });
      await createTask({ title: 'Task B', dueDate: '2030-01-02' });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);

      const task = response.body.data[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('dueDate');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('createdAt');
      expect(task).toHaveProperty('updatedAt');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Task');
      expect(response.body.data.dueDate).toBeNull();
      expect(response.body.data.completed).toBe(false);
    });

    it('should create a new task with optional due date', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task with due date', dueDate: '2030-05-21' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('Task with due date');
      expect(response.body.data.dueDate).toBe('2030-05-21');
    });

    it('should reject missing or empty title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details[0].field).toBe('title');
    });

    it('should reject invalid due date', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Bad date task', dueDate: 'not-a-date' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details[0].field).toBe('dueDate');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should edit title and due date', async () => {
      const task = await createTask({ title: 'Original task', dueDate: null });

      const updateResponse = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send({ title: 'Updated task title', dueDate: '2031-04-01' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.title).toBe('Updated task title');
      expect(updateResponse.body.data.dueDate).toBe('2031-04-01');
    });

    it('should toggle completed status', async () => {
      const task = await createTask({ title: 'Toggle completion' });

      const completeResponse = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send({ completed: true });
      expect(completeResponse.status).toBe(200);
      expect(completeResponse.body.data.completed).toBe(true);

      const incompleteResponse = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send({ completed: false });
      expect(incompleteResponse.status).toBe(200);
      expect(incompleteResponse.body.data.completed).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await createTask({ title: 'Task To Be Deleted' });

      const deleteResponse = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.data).toEqual({ id: task.id });

      const deleteAgain = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteAgain.status).toBe(404);
      expect(deleteAgain.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).delete('/api/tasks/999999');
      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 400 for invalid task id', async () => {
      const response = await request(app).delete('/api/tasks/abc');
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});