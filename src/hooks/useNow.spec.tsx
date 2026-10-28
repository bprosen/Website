import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useNow } from './useNow';

const NowProbe = () => <>{String(useNow())}</>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-15T12:00:00.400Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useNow', () => {
  it('starts at the current second', () => {
    const { result } = renderHook(() => useNow());

    expect(result.current).toBe(Date.parse('2026-01-15T12:00:00.000Z'));
  });

  it('ticks on the next second boundary, then every second', () => {
    const { result } = renderHook(() => useNow());

    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe(Date.parse('2026-01-15T12:00:00.000Z'));

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe(Date.parse('2026-01-15T12:00:01.000Z'));

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(Date.parse('2026-01-15T12:00:02.000Z'));
  });

  it('shares one timer across subscribers and stops when the last leaves', () => {
    const first = renderHook(() => useNow());
    const second = renderHook(() => useNow());

    expect(vi.getTimerCount()).toBe(1);

    first.unmount();
    expect(vi.getTimerCount()).toBe(1);

    second.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('is null when rendered on the server', () => {
    expect(renderToString(<NowProbe />)).toBe('null');
  });
});
