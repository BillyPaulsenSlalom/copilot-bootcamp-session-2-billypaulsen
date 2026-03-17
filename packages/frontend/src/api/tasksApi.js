const TASKS_ENDPOINT = '/api/tasks';

const normalizeApiError = async (response, fallbackMessage) => {
  let body = null;

  try {
    body = await response.json();
  } catch (error) {
    body = null;
  }

  const apiMessage = body?.error?.message;
  const details = body?.error?.details;
  const detailText = Array.isArray(details)
    ? details.map((detail) => detail.message).join(' ')
    : '';

  return new Error(apiMessage || detailText || fallbackMessage);
};

const requestJson = async (url, options, fallbackMessage) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw await normalizeApiError(response, fallbackMessage);
  }

  const payload = await response.json();
  return payload.data;
};

const fetchTasks = () => {
  return requestJson(TASKS_ENDPOINT, {}, 'Failed to load tasks.');
};

const createTask = (payload) => {
  return requestJson(
    TASKS_ENDPOINT,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    'Failed to add task.'
  );
};

const updateTask = (taskId, payload) => {
  return requestJson(
    `${TASKS_ENDPOINT}/${taskId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    'Failed to update task.'
  );
};

const deleteTask = (taskId) => {
  return requestJson(
    `${TASKS_ENDPOINT}/${taskId}`,
    {
      method: 'DELETE',
    },
    'Failed to delete task.'
  );
};

export { fetchTasks, createTask, updateTask, deleteTask };
