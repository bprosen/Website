import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useScrolledPast } from './useScrolledPast';

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

const observers: {
  callback: ObserverCallback;
  options?: IntersectionObserverInit;
}[] = [];
const disconnect = vi.fn();

class FakeIntersectionObserver {
  constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
    observers.push({ callback, options });
  }
  disconnect = disconnect;
  observe = vi.fn();
}

const notify = (isIntersecting: boolean, top: number) =>
  act(() =>
    observers[0].callback([
      { boundingClientRect: { top } as DOMRectReadOnly, isIntersecting },
    ]),
  );

describe('useScrolledPast', () => {
  beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    document.body.innerHTML =
      '<header id="cover"></header><h1 id="target">Name</h1>';
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(68);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('reports false until the element slides under the cover', () => {
    const { result } = renderHook(() => useScrolledPast('target', 'cover'));

    expect(result.current).toBe(false);
    expect(observers[0].options?.rootMargin).toBe('-68px 0px 0px 0px');

    notify(false, -40);
    expect(result.current).toBe(true);

    notify(true, 120);
    expect(result.current).toBe(false);
  });

  it('stays false when the element is out of view below the fold', () => {
    const { result } = renderHook(() => useScrolledPast('target', 'cover'));

    notify(false, 900);

    expect(result.current).toBe(false);
  });

  it('does nothing when the element is missing', () => {
    const { result } = renderHook(() => useScrolledPast('missing', 'cover'));

    expect(result.current).toBe(false);
    expect(observers).toHaveLength(0);
  });

  it('disconnects on unmount', () => {
    const { unmount } = renderHook(() => useScrolledPast('target', 'cover'));

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
