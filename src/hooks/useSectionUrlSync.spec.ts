import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSectionUrlSync } from './useSectionUrlSync';

let frames: FrameRequestCallback[] = [];

const setTops = (tops: Record<string, number>) => {
  for (const [id, top] of Object.entries(tops)) {
    const element = document.getElementById(id) as HTMLElement;
    element.getBoundingClientRect = () => ({ top }) as DOMRect;
  }
};

const scroll = () => {
  window.dispatchEvent(new Event('scroll'));
  const queued = frames;
  frames = [];
  for (const callback of queued) {
    callback(0);
  }
};

beforeEach(() => {
  frames = [];
  document.body.innerHTML =
    '<section id="work"></section><section id="about"></section><footer id="contact"></footer>';
  window.history.replaceState({ next: 'state' }, '', '/');
  vi.stubGlobal('innerHeight', 900);
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(
    10000,
  );
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    }),
  );
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
  window.history.replaceState(null, '', '/');
});

describe('useSectionUrlSync', () => {
  it('follows the section being read as the page scrolls', () => {
    renderHook(() => useSectionUrlSync());

    setTops({ about: 1500, contact: 3000, work: 200 });
    scroll();
    expect(window.location.pathname).toBe('/work');

    setTops({ about: 100, contact: 1600, work: -1200 });
    scroll();
    expect(window.location.pathname).toBe('/about');

    setTops({ about: 800, contact: 2300, work: 500 });
    scroll();
    expect(window.location.pathname).toBe('/');
  });

  it('replaces the history entry and keeps its state', () => {
    const push = vi.spyOn(window.history, 'pushState');
    renderHook(() => useSectionUrlSync());

    setTops({ about: 1500, contact: 3000, work: 0 });
    scroll();

    expect(push).not.toHaveBeenCalled();
    expect(window.history.state).toEqual({ next: 'state' });
  });

  it('leaves the URL alone while staying in the same section', () => {
    window.history.replaceState(null, '', '/work#w3');
    renderHook(() => useSectionUrlSync());

    setTops({ about: 1500, contact: 3000, work: -400 });
    scroll();

    expect(window.location.hash).toBe('#w3');
  });

  it('checks at most once per frame', () => {
    renderHook(() => useSectionUrlSync());

    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('stops listening when unmounted', () => {
    const { unmount } = renderHook(() => useSectionUrlSync());
    unmount();

    window.dispatchEvent(new Event('scroll'));

    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('updates the tab title along with the URL', () => {
    renderHook(() => useSectionUrlSync());

    setTops({ about: 100, contact: 1600, work: -1200 });
    scroll();

    expect(document.title).toBe('About · Ben Edgar-Prosen');
  });

  it('switches to the last section at the bottom of the page', () => {
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(
      2000,
    );
    vi.stubGlobal('scrollY', 1100);
    renderHook(() => useSectionUrlSync());

    setTops({ about: -900, contact: 500, work: -3000 });
    scroll();

    expect(window.location.pathname).toBe('/contact');
    expect(document.title).toBe('Contact · Ben Edgar-Prosen');
  });
});
