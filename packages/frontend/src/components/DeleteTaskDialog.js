import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

function DeleteTaskDialog({ task, open, onCancel, onConfirm, deleting = false }) {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="delete-task-title">
      <DialogTitle id="delete-task-title">Delete task?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action will permanently remove "{task?.title || 'this task'}".
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={deleting}>
          Cancel
        </Button>
        <Button color="error" onClick={onConfirm} variant="contained" disabled={deleting}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteTaskDialog;
