import { describe, expect, it } from 'vitest';
import { passedFraction, spansLine } from './progress';

describe('passedFraction', () => {
  it('is 0 before the block reaches the line', () => {
    expect(passedFraction(200, 400, 68)).toBe(0);
  });

  it('grows as the block scrolls past the line', () => {
    expect(passedFraction(-132, 400, 68)).toBe(0.5);
  });

  it('caps at 1 once the block is fully past', () => {
    expect(passedFraction(-1000, 400, 68)).toBe(1);
  });

  it('treats an empty block as not started', () => {
    expect(passedFraction(0, 0, 68)).toBe(0);
  });
});

describe('spansLine', () => {
  it('is true only while the block straddles the line', () => {
    expect(spansLine(0, 500, 68)).toBe(true);
    expect(spansLine(100, 500, 68)).toBe(false);
    expect(spansLine(-500, 40, 68)).toBe(false);
  });

  it('treats a block touching the line at either edge as not spanning it', () => {
    expect(spansLine(-100, 68, 68)).toBe(false);
    expect(spansLine(68, 500, 68)).toBe(false);
    expect(spansLine(67, 69, 68)).toBe(true);
  });
});
