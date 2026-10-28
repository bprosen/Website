import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const mockQuery = (initial: boolean) => {
  let matches = initial;
  let listener: () => void = () => {};
  const removeEventListener = vi.fn();
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: (_: string, next: () => void) => {
        listener = next;
      },
      get matches() {
        return matches;
      },
      removeEventListener,
    })),
  );
  return {
    change: (next: boolean) => {
      matches = next;
      listener();
    },
    removeEventListener,
  };
};

const ReducedMotionProbe = () => <>{String(usePrefersReducedMotion())}</>;

describe('usePrefersReducedMotion', () => {
  it('reflects the media query and follows changes', () => {
    const query = mockQuery(false);
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);

    act(() => query.change(true));
    expect(result.current).toBe(true);
  });

  it('stops listening when unmounted', () => {
    const query = mockQuery(true);
    const { unmount } = renderHook(() => usePrefersReducedMotion());

    unmount();

    expect(query.removeEventListener).toHaveBeenCalled();
  });

  it('assumes motion is allowed on the server', () => {
    expect(renderToString(<ReducedMotionProbe />)).toBe('false');
  });
});
