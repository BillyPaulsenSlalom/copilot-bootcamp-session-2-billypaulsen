import React from 'react';
import { Alert, Snackbar } from '@mui/material';

function TaskSnackbar({ notification, onClose }) {
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

export default TaskSnackbar;
