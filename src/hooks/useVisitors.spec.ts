import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UNKNOWN_VISITOR } from '~/utils';
import { useVisitors } from './useVisitors';

const { recordVisit } = vi.hoisted(() => ({ recordVisit: vi.fn() }));

vi.mock('~/api', () => ({ recordVisit }));

const flushTimers = () =>
  act(async () => {
    await vi.runAllTimersAsync();
  });

beforeEach(() => {
  vi.useFakeTimers();
  recordVisit.mockResolvedValue({
    dots: [[50, -97]],
    location: { city: 'Toronto', coords: [43.6, -79.4] },
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, 'webdriver');
});

describe('useVisitors', () => {
  it('waits for idle time, then loads the dots and the visitor once', async () => {
    const { result } = renderHook(() => useVisitors());

    expect(recordVisit).not.toHaveBeenCalled();
    expect(result.current).toEqual({ dots: [], visitor: UNKNOWN_VISITOR });

    await flushTimers();

    expect(recordVisit).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual({
      dots: [[50, -97]],
      visitor: {
        coords: [43.6, -79.4],
        label: 'You, near Toronto',
        sameCity: false,
      },
    });
  });

  it('recognizes visitors in Winnipeg', async () => {
    recordVisit.mockResolvedValue({
      dots: [],
      location: { city: 'Winnipeg', coords: [49.9, -97.1] },
    });
    const { result } = renderHook(() => useVisitors());

    await flushTimers();

    expect(result.current.visitor.sameCity).toBe(true);
  });

  it('uses requestIdleCallback when available', async () => {
    const requestIdle = vi.fn((callback: () => void) => {
      callback();
      return 7;
    });
    const cancelIdle = vi.fn();
    vi.stubGlobal('requestIdleCallback', requestIdle);
    vi.stubGlobal('cancelIdleCallback', cancelIdle);

    const { result, unmount } = renderHook(() => useVisitors());
    await act(async () => {});

    expect(requestIdle).toHaveBeenCalledTimes(1);
    expect(result.current.dots).toEqual([[50, -97]]);

    unmount();
    expect(cancelIdle).toHaveBeenCalledWith(7);
  });

  it('skips the request in automated browsers', async () => {
    Object.defineProperty(navigator, 'webdriver', {
      configurable: true,
      value: true,
    });
    renderHook(() => useVisitors());

    await flushTimers();

    expect(recordVisit).not.toHaveBeenCalled();
  });

  it('aborts and skips the request when unmounted first', async () => {
    const { unmount } = renderHook(() => useVisitors());

    unmount();
    await flushTimers();

    expect(recordVisit).not.toHaveBeenCalled();
  });

  it('aborts the request on unmount', async () => {
    recordVisit.mockReturnValue(new Promise(() => {}));
    const { unmount } = renderHook(() => useVisitors());

    await flushTimers();
    const signal: AbortSignal = recordVisit.mock.calls[0][0];
    unmount();

    expect(signal.aborted).toBe(true);
  });

  it('keeps the same result when the server knows nothing', async () => {
    recordVisit.mockResolvedValue({ dots: [], location: null });
    const { result } = renderHook(() => useVisitors());
    const initial = result.current;

    await flushTimers();

    expect(result.current).toBe(initial);
  });

  it('shows the dots when the visitor cannot be placed', async () => {
    recordVisit.mockResolvedValue({ dots: [[50, -97]], location: null });
    const { result } = renderHook(() => useVisitors());

    await flushTimers();

    expect(result.current.dots).toEqual([[50, -97]]);
    expect(result.current.visitor).toBe(UNKNOWN_VISITOR);
  });

  it('keeps the same empty dot list when only the visitor is known', async () => {
    recordVisit.mockResolvedValue({
      dots: [],
      location: { city: 'Toronto', coords: [43.6, -79.4] },
    });
    const { result } = renderHook(() => useVisitors());
    const initialDots = result.current.dots;

    await flushTimers();

    expect(result.current.dots).toBe(initialDots);
    expect(result.current.visitor.label).toBe('You, near Toronto');
  });
});
