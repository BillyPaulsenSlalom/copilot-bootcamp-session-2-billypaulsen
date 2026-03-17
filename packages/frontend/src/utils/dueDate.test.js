import timezoneMock from 'timezone-mock';
import { formatDueDate } from './dueDate';

describe('formatDueDate', () => {
  afterEach(() => {
    timezoneMock.unregister();
  });

  test('keeps date-only due dates on the same calendar day in Pacific time', () => {
    timezoneMock.register('US/Pacific');

    expect(formatDueDate('2030-07-10')).toBe(new Date(2030, 6, 10).toLocaleDateString());
  });

  test('returns the original value when the due date cannot be parsed', () => {
    expect(formatDueDate('not-a-date')).toBe('not-a-date');
  });
});