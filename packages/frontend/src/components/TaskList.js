import React from 'react';
import { List, Paper, Typography } from '@mui/material';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggleComplete, onEditTask, onRequestDelete, disabled = false }) {
  if (tasks.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: '1px solid var(--color-divider)' }}>
        <Typography variant="h6" gutterBottom>
          No tasks yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first task above to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: '1px solid var(--color-divider)' }}>
      <List>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEditTask={onEditTask}
            onRequestDelete={onRequestDelete}
            disabled={disabled}
          />
        ))}
      </List>
    </Paper>
  );
}

export default TaskList;
