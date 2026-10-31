import { renderHook } from '@testing-library/react';
import type { TouchEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useSwipe } from './useSwipe';

const touches = (...points: [number, number][]) =>
  points.map(([clientX, clientY]) => ({ clientX, clientY }));

const touchEvent = (event: {
  changedTouches?: ReturnType<typeof touches>;
  touches?: ReturnType<typeof touches>;
}) =>
  ({
    changedTouches: event.changedTouches ?? [],
    touches: event.touches ?? [],
  }) as unknown as TouchEvent;

const swipe = (
  handlers: ReturnType<typeof useSwipe>,
  start: ReturnType<typeof touches>,
  end: ReturnType<typeof touches>,
) => {
  handlers.onTouchStart(touchEvent({ touches: start }));
  handlers.onTouchEnd(touchEvent({ changedTouches: end }));
};

describe('useSwipe', () => {
  it('steps forward on a left swipe and back on a right swipe', () => {
    const onStep = vi.fn();
    const { result } = renderHook(() => useSwipe(onStep));

    swipe(result.current, touches([300, 100]), touches([100, 110]));
    swipe(result.current, touches([100, 100]), touches([300, 90]));

    expect(onStep.mock.calls).toEqual([[1], [-1]]);
  });

  it('ignores taps and vertical scrolls', () => {
    const onStep = vi.fn();
    const { result } = renderHook(() => useSwipe(onStep));

    swipe(result.current, touches([100, 100]), touches([104, 102]));
    swipe(result.current, touches([100, 100]), touches([160, 400]));

    expect(onStep).not.toHaveBeenCalled();
  });

  it('ignores pinches that start with two fingers', () => {
    const onStep = vi.fn();
    const { result } = renderHook(() => useSwipe(onStep));

    swipe(result.current, touches([300, 100], [350, 100]), touches([100, 100]));

    expect(onStep).not.toHaveBeenCalled();
  });

  it('ignores a touch end without a matching start', () => {
    const onStep = vi.fn();
    const { result } = renderHook(() => useSwipe(onStep));

    result.current.onTouchEnd(touchEvent({ changedTouches: touches([0, 0]) }));

    expect(onStep).not.toHaveBeenCalled();
  });
});
