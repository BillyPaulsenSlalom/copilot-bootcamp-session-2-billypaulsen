const MAX_TITLE_LENGTH = 200;

const isValidDate = (value) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
};

const validateTitle = (title, details, isRequired = false) => {
  if (title === undefined) {
    if (isRequired) {
      details.push({ field: 'title', message: 'Title is required.' });
    }
    return;
  }

  if (typeof title !== 'string' || title.trim() === '') {
    details.push({ field: 'title', message: 'Title must be a non-empty string.' });
    return;
  }

  if (title.trim().length > MAX_TITLE_LENGTH) {
    details.push({
      field: 'title',
      message: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
    });
  }
};

const validateDueDate = (dueDate, details) => {
  if (dueDate === undefined) {
    return;
  }

  if (!isValidDate(dueDate)) {
    details.push({
      field: 'dueDate',
      message: 'Due date must be null or a valid date string.',
    });
  }
};

const validateCompleted = (completed, details) => {
  if (completed === undefined) {
    return;
  }

  if (typeof completed !== 'boolean') {
    details.push({
      field: 'completed',
      message: 'Completed must be a boolean value.',
    });
  }
};

const validateCreateTask = (payload) => {
  const details = [];
  validateTitle(payload.title, details, true);
  validateDueDate(payload.dueDate, details);

  return {
    isValid: details.length === 0,
    details,
  };
};

const validateUpdateTask = (payload) => {
  const details = [];
  const hasSupportedField =
    payload.title !== undefined ||
    payload.dueDate !== undefined ||
    payload.completed !== undefined;

  if (!hasSupportedField) {
    details.push({
      field: 'payload',
      message: 'At least one of title, dueDate, or completed must be provided.',
    });
  }

  validateTitle(payload.title, details, false);
  validateDueDate(payload.dueDate, details);
  validateCompleted(payload.completed, details);

  return {
    isValid: details.length === 0,
    details,
  };
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
};
