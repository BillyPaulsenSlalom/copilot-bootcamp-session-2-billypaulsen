import React, { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';

function TaskForm({ onSubmit, disabled = false }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setTitleError('Task title is required.');
      return;
    }

    await onSubmit({
      title: title.trim(),
      dueDate: dueDate || null,
    });

    setTitle('');
    setDueDate('');
    setTitleError('');
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add task form">
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          label="Task title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (titleError) {
              setTitleError('');
            }
          }}
          required
          fullWidth
          disabled={disabled}
          error={Boolean(titleError)}
          helperText={titleError || 'Use a clear, specific action.'}
          inputProps={{
            maxLength: 200,
          }}
        />
        <TextField
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
          helperText="Optional"
          sx={{ minWidth: { xs: '100%', md: 200 } }}
        />
        <Button type="submit" variant="contained" disabled={disabled} sx={{ minWidth: 132 }}>
          Add task
        </Button>
      </Stack>
    </form>
  );
}

export default TaskForm;
