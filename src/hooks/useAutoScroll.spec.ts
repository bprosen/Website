import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTO_SCROLL_RESUME_MS } from '~/constants';
import { useAutoScroll } from './useAutoScroll';

const TILE_PX = 100;
const SPEED = 50;

let frames: FrameRequestCallback[] = [];
let intersect: (visible: boolean) => void = () => {};
const disconnect = vi.fn();

const runFrame = (time: number) => {
  const pending = frames;
  frames = [];
  for (const callback of pending) {
    callback(time);
  }
};

const buildScroller = () => {
  const scroller = document.createElement('div');
  const list = document.createElement('ul');
  for (let index = 0; index < 4; index += 1) {
    const item = document.createElement('li');
    Object.defineProperty(item, 'offsetLeft', { value: index * TILE_PX });
    list.append(item);
  }
  scroller.append(list);
  document.body.append(scroller);
  return scroller;
};

const renderAutoScroll = (scroller: HTMLElement) =>
  renderHook(() => useAutoScroll({ current: scroller }, SPEED));

describe('useAutoScroll', () => {
  beforeEach(() => {
    frames = [];
    intersect = () => {};
    document.body.innerHTML = '';
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {
      frames = [];
    });
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(
          callback: (entries: { isIntersecting: boolean }[]) => void,
        ) {
          intersect = (visible) => callback([{ isIntersecting: visible }]);
        }
        disconnect = disconnect;
        observe = vi.fn();
      },
    );
  });

  it('drifts while visible and loops back after one set of tiles', () => {
    const scroller = buildScroller();
    renderAutoScroll(scroller);

    intersect(true);
    runFrame(0);
    runFrame(1000);
    expect(scroller.scrollLeft).toBe(SPEED);

    runFrame(4000);
    expect(scroller.scrollLeft).toBe(SPEED * 4 - 2 * TILE_PX);
  });

  it('picks up from wherever the strip was scrolled to', () => {
    const scroller = buildScroller();
    renderAutoScroll(scroller);
    intersect(true);
    runFrame(0);

    scroller.scrollLeft = 2 * TILE_PX - 10;
    runFrame(1000);

    expect(scroller.scrollLeft).toBe(SPEED - 10);
  });

  it('stays put while offscreen', () => {
    const scroller = buildScroller();
    renderAutoScroll(scroller);

    intersect(true);
    intersect(false);

    expect(frames).toHaveLength(0);
  });

  it('holds while touched and waits before resuming', () => {
    const scroller = buildScroller();
    renderAutoScroll(scroller);
    intersect(true);
    runFrame(0);

    scroller.dispatchEvent(new Event('touchstart'));
    runFrame(1000);
    expect(scroller.scrollLeft).toBe(0);

    vi.spyOn(performance, 'now').mockReturnValue(1000);
    scroller.dispatchEvent(new Event('touchend'));
    runFrame(1000 + AUTO_SCROLL_RESUME_MS - 1);
    expect(scroller.scrollLeft).toBe(0);

    runFrame(2000 + AUTO_SCROLL_RESUME_MS);
    expect(scroller.scrollLeft).toBeGreaterThan(0);
  });

  it('pauses for keyboard focus but not for focus returned after a tap', () => {
    const scroller = buildScroller();
    const tile = document.createElement('button');
    scroller.append(tile);
    renderAutoScroll(scroller);
    intersect(true);
    runFrame(0);

    const focusVisible = vi.spyOn(tile, 'matches').mockReturnValue(false);

    tile.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    runFrame(1000);
    expect(scroller.scrollLeft).toBe(SPEED);

    focusVisible.mockReturnValue(true);
    tile.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    runFrame(2000);
    expect(scroller.scrollLeft).toBe(SPEED);
  });

  it('does nothing when reduced motion is preferred', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: true,
        removeEventListener: vi.fn(),
      })),
    );
    const scroller = buildScroller();
    renderAutoScroll(scroller);

    intersect(true);

    expect(frames).toHaveLength(0);
  });

  it('cleans up on unmount', () => {
    const scroller = buildScroller();
    const { unmount } = renderAutoScroll(scroller);
    intersect(true);

    unmount();

    expect(frames).toHaveLength(0);
    expect(disconnect).toHaveBeenCalled();
  });
});
