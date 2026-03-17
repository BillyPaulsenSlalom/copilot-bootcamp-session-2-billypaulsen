import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

function formatDueDate(dueDate) {
  if (!dueDate) {
    return 'No due date';
  }

  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) {
    return dueDate;
  }

  return parsed.toLocaleDateString();
}

function TaskItem({ task, onToggleComplete, onEditTask, onRequestDelete, disabled = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || '');
  const [titleError, setTitleError] = useState('');

  const handleSave = async () => {
    if (!editedTitle.trim()) {
      setTitleError('Task title is required.');
      return;
    }

    await onEditTask(task.id, {
      title: editedTitle.trim(),
      dueDate: editedDueDate || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDueDate(task.dueDate || '');
    setTitleError('');
    setIsEditing(false);
  };

  return (
    <ListItem
      divider
      alignItems="flex-start"
      secondaryAction={
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit task">
            <span>
              <IconButton
                edge="end"
                aria-label={`Edit ${task.title}`}
                onClick={() => setIsEditing(true)}
                disabled={disabled}
              >
                <EditOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete task">
            <span>
              <IconButton
                edge="end"
                aria-label={`Delete ${task.title}`}
                onClick={() => onRequestDelete(task)}
                disabled={disabled}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      }
    >
      <Box sx={{ width: '100%', pr: 9 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
          <Checkbox
            checked={task.completed}
            onChange={(event) => onToggleComplete(task.id, event.target.checked)}
            disabled={disabled}
            inputProps={{ 'aria-label': `Mark ${task.title} complete` }}
          />
          <ListItemText
            primary={
              <Typography
                variant="body1"
                sx={{ textDecoration: task.completed ? 'line-through' : 'none', fontWeight: 600 }}
              >
                {task.title}
              </Typography>
            }
            secondary={`Due: ${formatDueDate(task.dueDate)}`}
          />
          <Chip
            label={task.completed ? 'Completed' : 'Active'}
            color={task.completed ? 'success' : 'primary'}
            size="small"
          />
        </Stack>

        {isEditing && (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            mt={1.5}
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                handleCancel();
              }
            }}
          >
            <TextField
              label="Edit title"
              value={editedTitle}
              onChange={(event) => {
                setEditedTitle(event.target.value);
                if (titleError) {
                  setTitleError('');
                }
              }}
              fullWidth
              error={Boolean(titleError)}
              helperText={titleError || 'Update your task title'}
              autoFocus
            />
            <TextField
              label="Edit due date"
              type="date"
              value={editedDueDate}
              onChange={(event) => setEditedDueDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: '100%', md: 190 } }}
            />
            <Button type="submit" variant="contained" disabled={disabled}>
              Save
            </Button>
            <Button type="button" variant="outlined" onClick={handleCancel} disabled={disabled}>
              Cancel
            </Button>
          </Stack>
        )}
      </Box>
    </ListItem>
  );
}

export default TaskItem;
