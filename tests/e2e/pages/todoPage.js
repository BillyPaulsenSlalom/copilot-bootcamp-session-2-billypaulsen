const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page) {
    this.page = page;
    this.taskTitleInput = page.getByLabel('Task title');
    this.dueDateInput = page.getByLabel('Due date');
    this.addTaskButton = page.getByRole('button', { name: 'Add task' });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: 'Calm Task Board' })).toBeVisible();
  }

  async addTask(title, dueDate = null) {
    await this.taskTitleInput.fill(title);
    if (dueDate) {
      await this.dueDateInput.fill(dueDate);
    }
    await this.addTaskButton.click();
  }

  taskRow(title) {
    return this.page.locator('li', { hasText: title });
  }

  async toggleTask(title) {
    await this.page.getByRole('checkbox', { name: `Mark ${title} complete` }).click();
  }

  async openEdit(title) {
    await this.page.getByRole('button', { name: `Edit ${title}` }).click();
  }

  async saveEdit(title, nextTitle, nextDueDate) {
    const row = this.taskRow(title);
    await row.getByLabel('Edit title').fill(nextTitle);
    if (nextDueDate) {
      await row.getByLabel('Edit due date').fill(nextDueDate);
    }
    await row.getByRole('button', { name: 'Save' }).click();
  }

  async openDelete(title) {
    await this.page.getByRole('button', { name: `Delete ${title}` }).click();
  }
}

module.exports = {
  TodoPage,
};
