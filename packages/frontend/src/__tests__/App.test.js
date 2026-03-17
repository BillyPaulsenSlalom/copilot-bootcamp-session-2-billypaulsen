import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

let tasks = [];

const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: tasks }));
  }),

  rest.post('/api/tasks', async (req, res, ctx) => {
    const payload = await req.json();
    if (!payload.title || !payload.title.trim()) {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Task payload is invalid.',
            details: [{ field: 'title', message: 'Task title is required.' }],
          },
        })
      );
    }

    const createdTask = {
      id: Date.now(),
      title: payload.title,
      dueDate: payload.dueDate || null,
      completed: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    tasks = [createdTask, ...tasks];

    return res(ctx.status(201), ctx.json({ data: createdTask }));
  }),

  rest.patch('/api/tasks/:id', async (req, res, ctx) => {
    const taskId = Number(req.params.id);
    const payload = await req.json();
    const existingTask = tasks.find((task) => task.id === taskId);

    if (!existingTask) {
      return res(
        ctx.status(404),
        ctx.json({
          error: {
            code: 'NOT_FOUND',
            message: 'Task not found.',
            details: [],
          },
        })
      );
    }

    const updatedTask = {
      ...existingTask,
      ...payload,
      updatedAt: '2026-01-02T00:00:00.000Z',
    };
    tasks = tasks.map((task) => (task.id === taskId ? updatedTask : task));

    return res(ctx.status(200), ctx.json({ data: updatedTask }));
  }),

  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    const taskId = Number(req.params.id);
    tasks = tasks.filter((task) => task.id !== taskId);

    return res(
      ctx.status(200),
      ctx.json({
        data: {
          id: taskId,
        },
      })
    );
  })
);

beforeAll(() => server.listen());
beforeEach(() => {
  tasks = [
    {
      id: 1,
      title: 'Write docs',
      dueDate: '2030-07-10',
      completed: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      title: 'Ship update',
      dueDate: null,
      completed: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App', () => {
  test('renders initial load and task list', async () => {
    render(<App />);

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Write docs')).toBeInTheDocument();
      expect(screen.getByText('Ship update')).toBeInTheDocument();
    });
  });

  test('renders empty state when there are no tasks', async () => {
    tasks = [];
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });
  });

  test('supports add task flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Write docs');
    fireEvent.change(screen.getByLabelText(/Task title/i), {
      target: { value: 'Plan sprint retro' },
    });
    fireEvent.change(screen.getByLabelText(/Due date/i), { target: { value: '2030-01-15' } });
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    await waitFor(() => {
      expect(screen.getByText('Plan sprint retro')).toBeInTheDocument();
      expect(screen.getByText('Task added successfully.')).toBeInTheDocument();
    });
  }, 10000);

  test('supports complete and uncomplete task flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    const checkbox = await screen.findByRole('checkbox', { name: /Mark Write docs complete/i });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });

    await user.click(checkbox);
    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
    });
  });

  test('supports edit title and due date flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    const editButton = await screen.findByRole('button', { name: /Edit Write docs/i });
    await user.click(editButton);

    const titleField = screen.getByLabelText('Edit title');
    fireEvent.change(titleField, { target: { value: 'Write release notes' } });
    fireEvent.change(screen.getByLabelText('Edit due date'), { target: { value: '2030-09-01' } });
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByText('Write release notes')).toBeInTheDocument();
    });
  }, 10000);

  test('supports delete flow with confirmation dialog', async () => {
    const user = userEvent.setup();
    render(<App />);

    const deleteButton = await screen.findByRole('button', { name: /Delete Write docs/i });
    await user.click(deleteButton);

    const dialog = screen.getByRole('dialog', { name: 'Delete task?' });
    expect(within(dialog).getByText(/permanently remove/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.queryByText('Write docs')).not.toBeInTheDocument();
    });
  });

  test('shows visible error feedback when API fails', async () => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Failed to fetch tasks.',
              details: [],
            },
          })
        );
      })
    );

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/)).toBeInTheDocument();
    });
  });

  test('supports keyboard flow with Enter submit and Escape close', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Write docs');
    await user.type(screen.getByLabelText(/Task title/i), 'K{enter}');

    await waitFor(() => {
      expect(screen.getByText('K')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /Delete Write docs/i });
    await user.click(deleteButton);
    expect(screen.getByRole('dialog', { name: 'Delete task?' })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Delete task?' })).not.toBeInTheDocument();
    });
  }, 10000);
});