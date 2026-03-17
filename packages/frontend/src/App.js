import React, { useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import DeleteTaskDialog from './components/DeleteTaskDialog';
import TaskSnackbar from './components/TaskSnackbar';
import { createTask, deleteTask, fetchTasks, updateTask } from './api/tasksApi';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTaskForDelete, setSelectedTaskForDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#2F6FA8',
            dark: '#1E4F7A',
            light: '#EAF3FB',
          },
          secondary: {
            main: '#5AA3D6',
          },
          background: {
            default: '#F7FAFD',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#1F2A37',
            secondary: '#4B5B6B',
          },
          error: {
            main: '#B3261E',
          },
          success: {
            main: '#2E7D32',
          },
        },
        shape: {
          borderRadius: 12,
        },
      }),
    []
  );

  useEffect(() => {
    loadTasks();
  }, []);

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const result = await fetchTasks();
      setTasks(result);
    } catch (err) {
      showNotification(`Failed to fetch tasks: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (payload) => {
    try {
      setSubmitting(true);
      const createdTask = await createTask(payload);
      setTasks((currentTasks) => [createdTask, ...currentTasks]);
      showNotification('Task added successfully.');
    } catch (err) {
      showNotification(`Error adding task: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      setSubmitting(true);
      const updatedTask = await updateTask(taskId, updates);
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
      showNotification('Task updated successfully.');
    } catch (err) {
      showNotification(`Error updating task: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTaskForDelete) {
      return;
    }

    try {
      setSubmitting(true);
      await deleteTask(selectedTaskForDelete.id);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== selectedTaskForDelete.id)
      );
      setSelectedTaskForDelete(null);
      showNotification('Task deleted successfully.');
    } catch (err) {
      showNotification(`Error deleting task: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static" elevation={0} className="App-bar">
          <Toolbar>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Calm Task Board
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Stack spacing={3}>
            <Paper elevation={0} className="App-panel">
              <Typography variant="h6" component="h2" gutterBottom>
                Create a task
              </Typography>
              <TaskForm onSubmit={handleCreateTask} disabled={submitting} />
            </Paper>

            <Paper elevation={0} className="App-panel">
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h2">
                  Task list
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tasks.length} task{tasks.length === 1 ? '' : 's'}
                </Typography>
              </Stack>

              {loading ? (
                <Box display="flex" alignItems="center" gap={1.5} role="status" aria-live="polite">
                  <CircularProgress size={22} />
                  <Typography>Loading tasks...</Typography>
                </Box>
              ) : (
                <TaskList
                  tasks={tasks}
                  onToggleComplete={(taskId, completed) => handleUpdateTask(taskId, { completed })}
                  onEditTask={handleUpdateTask}
                  onRequestDelete={setSelectedTaskForDelete}
                  disabled={submitting}
                />
              )}
            </Paper>
          </Stack>
        </Container>

        <DeleteTaskDialog
          task={selectedTaskForDelete}
          open={Boolean(selectedTaskForDelete)}
          onCancel={() => setSelectedTaskForDelete(null)}
          onConfirm={handleConfirmDelete}
          deleting={submitting}
        />

        <TaskSnackbar
          notification={notification}
          onClose={() => setNotification((current) => ({ ...current, open: false }))}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;