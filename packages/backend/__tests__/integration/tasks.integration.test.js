const request = require('supertest');
const { app, db } = require('../../src/app');

describe('Tasks API integration', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM tasks').run();
  });

  test('supports full task lifecycle', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Integration task', dueDate: '2032-01-10' })
      .set('Accept', 'application/json');

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.title).toBe('Integration task');

    const taskId = createResponse.body.data.id;

    const getResponse = await request(app).get('/api/tasks');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data).toHaveLength(1);

    const updateResponse = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ completed: true, title: 'Integration task updated' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.completed).toBe(true);
    expect(updateResponse.body.data.title).toBe('Integration task updated');

    const deleteResponse = await request(app).delete(`/api/tasks/${taskId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data.id).toBe(taskId);

    const listAfterDelete = await request(app).get('/api/tasks');
    expect(listAfterDelete.status).toBe(200);
    expect(listAfterDelete.body.data).toHaveLength(0);
  });

  test('returns consistent validation and not-found responses', async () => {
    const badCreate = await request(app)
      .post('/api/tasks')
      .send({ title: '' })
      .set('Accept', 'application/json');

    expect(badCreate.status).toBe(400);
    expect(badCreate.body.error.code).toBe('VALIDATION_ERROR');

    const missingTask = await request(app)
      .patch('/api/tasks/99999')
      .send({ completed: true });

    expect(missingTask.status).toBe(404);
    expect(missingTask.body.error.code).toBe('NOT_FOUND');
  });
});
