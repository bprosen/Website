import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubIntersectionObserver } from '~/lib/testing';
import { useScrolledPast } from './useScrolledPast';

let observer: ReturnType<typeof stubIntersectionObserver>;

const notify = (isIntersecting: boolean, top: number) =>
  act(() =>
    observer.intersect({
      boundingClientRect: { top } as DOMRectReadOnly,
      isIntersecting,
    }),
  );

describe('useScrolledPast', () => {
  beforeEach(() => {
    observer = stubIntersectionObserver();
    document.body.innerHTML =
      '<header id="cover"></header><h1 id="target">Name</h1>';
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(68);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('reports false until the element slides under the cover', () => {
    const { result } = renderHook(() =>
      useScrolledPast({ coverId: 'cover', targetId: 'target' }),
    );

    expect(result.current).toBe(false);
    expect(observer.observers[0].options?.rootMargin).toBe('-68px 0px 0px 0px');

    notify(false, -40);
    expect(result.current).toBe(true);

    notify(true, 120);
    expect(result.current).toBe(false);
  });

  it('counts the element as scrolled past once it slides under the cover', () => {
    const { result } = renderHook(() =>
      useScrolledPast({ coverId: 'cover', targetId: 'target' }),
    );

    notify(false, 30);

    expect(result.current).toBe(true);
  });

  it('stays false when the element is out of view below the fold', () => {
    const { result } = renderHook(() =>
      useScrolledPast({ coverId: 'cover', targetId: 'target' }),
    );

    notify(false, 900);

    expect(result.current).toBe(false);
  });

  it('does nothing when the element is missing', () => {
    const { result } = renderHook(() =>
      useScrolledPast({ coverId: 'cover', targetId: 'missing' }),
    );

    expect(result.current).toBe(false);
    expect(observer.observers).toHaveLength(0);
  });

  it('disconnects on unmount', () => {
    const { unmount } = renderHook(() =>
      useScrolledPast({ coverId: 'cover', targetId: 'target' }),
    );

    unmount();

    expect(observer.observers[0].disconnect).toHaveBeenCalled();
  });
});
