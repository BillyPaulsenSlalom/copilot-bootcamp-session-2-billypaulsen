const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function createDisplayDate(dueDate) {
  const dateOnlyMatch = DATE_ONLY_PATTERN.exec(dueDate);

  if (!dateOnlyMatch) {
    return new Date(dueDate);
  }

  const [, year, month, day] = dateOnlyMatch;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function formatDueDate(dueDate) {
  if (!dueDate) {
    return 'No due date';
  }

  const parsed = createDisplayDate(dueDate);
  if (Number.isNaN(parsed.getTime())) {
    return dueDate;
  }

  return parsed.toLocaleDateString();
}