const mapTaskRow = (row) => ({
  id: row.id,
  title: row.title,
  dueDate: row.due_date,
  completed: Boolean(row.completed),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

module.exports = {
  mapTaskRow,
};
