import { describe, expect, it } from 'vitest';
import { formatClock } from './time';

describe('formatClock', () => {
  it('formats winter afternoons in Winnipeg (CST, UTC-6)', () => {
    expect(
      formatClock(Date.parse('2026-01-15T21:04:05Z'), 'America/Winnipeg'),
    ).toBe('3:04:05 PM');
  });

  it('formats summer mornings in Winnipeg (CDT, UTC-5)', () => {
    expect(
      formatClock(new Date('2026-07-01T14:00:09Z'), 'America/Winnipeg'),
    ).toBe('9:00:09 AM');
  });

  it('formats midnight as 12', () => {
    expect(
      formatClock(Date.parse('2026-01-15T06:00:00Z'), 'America/Winnipeg'),
    ).toBe('12:00:00 AM');
  });

  it('works for any time zone', () => {
    expect(formatClock(Date.parse('2026-01-15T00:30:00Z'), 'Asia/Tokyo')).toBe(
      '9:30:00 AM',
    );
  });
});
