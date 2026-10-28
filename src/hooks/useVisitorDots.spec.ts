import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useVisitorDots } from './useVisitorDots';

const { recordVisit } = vi.hoisted(() => ({ recordVisit: vi.fn() }));

vi.mock('~/api', () => ({ recordVisit }));

beforeEach(() => {
  vi.useFakeTimers();
  recordVisit.mockResolvedValue([[50, -97]]);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useVisitorDots', () => {
  it('waits for idle time, then loads the dots once', async () => {
    const { result } = renderHook(() => useVisitorDots());

    expect(recordVisit).not.toHaveBeenCalled();
    expect(result.current).toEqual([]);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(recordVisit).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual([[50, -97]]);
  });

  it('uses requestIdleCallback when available', async () => {
    const requestIdle = vi.fn((callback: () => void) => {
      callback();
      return 7;
    });
    const cancelIdle = vi.fn();
    vi.stubGlobal('requestIdleCallback', requestIdle);
    vi.stubGlobal('cancelIdleCallback', cancelIdle);

    const { result, unmount } = renderHook(() => useVisitorDots());
    await act(async () => {});

    expect(requestIdle).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual([[50, -97]]);

    unmount();
    expect(cancelIdle).toHaveBeenCalledWith(7);
  });

  it('aborts and skips the request when unmounted first', async () => {
    const { unmount } = renderHook(() => useVisitorDots());

    unmount();
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(recordVisit).not.toHaveBeenCalled();
  });

  it('ignores results that arrive after unmount', async () => {
    let resolve: (value: unknown) => void = () => {};
    recordVisit.mockReturnValue(new Promise((done) => (resolve = done)));
    const { result, unmount } = renderHook(() => useVisitorDots());

    await act(async () => {
      await vi.runAllTimersAsync();
    });
    const signal: AbortSignal = recordVisit.mock.calls[0][0];
    unmount();
    resolve([[1, 2]]);

    expect(signal.aborted).toBe(true);
    expect(result.current).toEqual([]);
  });

  it('keeps an empty list when there are no visitors', async () => {
    recordVisit.mockResolvedValue([]);
    const { result } = renderHook(() => useVisitorDots());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current).toEqual([]);
  });
});
