import { describe, expect, it } from 'vitest';
import { timelineClass, timelineLinkClass } from './timeline';

describe('timelineClass', () => {
  it('names the view timeline an entry drives', () => {
    expect(timelineClass('w2')).toBe('timeline-w2');
  });
});

describe('timelineLinkClass', () => {
  it('names the nav link that follows that timeline', () => {
    expect(timelineLinkClass('w2')).toBe('timeline-link-w2');
  });
});
