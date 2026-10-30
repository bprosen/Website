import { describe, expect, it } from 'vitest';
import { clamp, RADIANS_PER_DEGREE } from './math';

describe('clamp', () => {
  it('keeps values inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe('RADIANS_PER_DEGREE', () => {
  it('turns a half turn into pi', () => {
    expect(180 * RADIANS_PER_DEGREE).toBeCloseTo(Math.PI);
  });
});
