const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pages/todoPage');

test.describe('Todo app core journeys', () => {
  test('creates a task and displays it in the list', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addTask('E2E create task', '2033-03-21');
    await expect(page.getByText('E2E create task')).toBeVisible();
    await expect(page.getByText(/Task added successfully/)).toBeVisible();
  });

  test('edits title and due date', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addTask('E2E edit original', '2033-06-10');
    await todo.openEdit('E2E edit original');
    await todo.saveEdit('E2E edit original', 'E2E edit updated', '2033-07-11');

    await expect(page.getByText('E2E edit updated')).toBeVisible();
    await expect(page.getByText(/Task updated successfully/)).toBeVisible();
  });

  test('toggles completed status', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addTask('E2E toggle task');
    await todo.toggleTask('E2E toggle task');
    await expect(page.getByText('Completed')).toBeVisible();
  });

  test('deletes a task after confirmation', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addTask('E2E delete me');
    await todo.openDelete('E2E delete me');
    await expect(page.getByRole('dialog', { name: 'Delete task?' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText('E2E delete me')).toHaveCount(0);
  });

  test('supports keyboard submission and Escape to close dialog', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await page.getByLabel('Task title').fill('E2E keyboard task');
    await page.keyboard.press('Enter');
    await expect(page.getByText('E2E keyboard task')).toBeVisible();

    await todo.openDelete('E2E keyboard task');
    await expect(page.getByRole('dialog', { name: 'Delete task?' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Delete task?' })).toHaveCount(0);
  });
});
