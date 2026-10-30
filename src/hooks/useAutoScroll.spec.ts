import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTO_SCROLL_RESUME_MS, MOTION_PAUSED_ATTRIBUTE } from '~/constants';
import {
  stubAnimationFrames,
  stubIntersectionObserver,
  stubReducedMotion,
} from '~/lib/testing';
import { useAutoScroll } from './useAutoScroll';

const TILE_PX = 100;
const SPEED_PX_PER_SECOND = 50;
const TILE_COUNT = 4;

let frames: ReturnType<typeof stubAnimationFrames>;
let observer: ReturnType<typeof stubIntersectionObserver>;
const intersect = (visible: boolean) => observer.intersect(visible);
const runFrame = (time: number) => frames.run(time);

const buildScroller = (tileCount = TILE_COUNT) => {
  const scroller = document.createElement('div');
  const list = document.createElement('ul');
  for (let index = 0; index < tileCount; index++) {
    const item = document.createElement('li');
    Object.defineProperty(item, 'offsetLeft', { value: index * TILE_PX });
    list.append(item);
  }
  scroller.append(list);
  document.body.append(scroller);
  return scroller;
};

const renderAutoScroll = (scroller: HTMLElement) =>
  renderHook(() => useAutoScroll({ current: scroller }, SPEED_PX_PER_SECOND));

describe('useAutoScroll', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    frames = stubAnimationFrames();
    observer = stubIntersectionObserver();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('drifts while visible and loops back after one set of tiles', () => {
    const scroller = buildScroller();
    renderAutoScroll(scroller);

    intersect(true);
    runFrame(0);
    runFrame(1000);
    expect(scroller.scrollLeft).toBe(SPEED_PX_PER_SECOND);

    runFrame(4000);
    expect(scroller.scrollLeft).toBe(SPEED_PX_PER_SECOND * 4 - 2 * TILE_PX);
  });

  it('picks up from wherever the strip was scrolled to', () => {
    const scroller = buildScroller();
    renderAutoScroll(scroller);
    intersect(true);
    runFrame(0);

    scroller.scrollLeft = 2 * TILE_PX - 10;
    runFrame(1000);

    expect(scroller.scrollLeft).toBe(SPEED_PX_PER_SECOND - 10);
  });

  it('stays put while offscreen', () => {
    const scroller = buildScroller();
    renderAutoScroll(scroller);

    intersect(true);
    intersect(false);

    expect(frames.pending()).toBe(0);
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
    expect(scroller.scrollLeft).toBe(SPEED_PX_PER_SECOND);

    focusVisible.mockReturnValue(true);
    tile.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    runFrame(2000);
    expect(scroller.scrollLeft).toBe(SPEED_PX_PER_SECOND);
  });

  it('holds while a mouse hovers and resumes after it leaves', () => {
    const scroller = buildScroller();
    renderAutoScroll(scroller);
    intersect(true);
    runFrame(0);

    scroller.dispatchEvent(
      new PointerEvent('pointerenter', { pointerType: 'mouse' }),
    );
    runFrame(1000);
    expect(scroller.scrollLeft).toBe(0);

    vi.spyOn(performance, 'now').mockReturnValue(1000);
    scroller.dispatchEvent(
      new PointerEvent('pointerleave', { pointerType: 'mouse' }),
    );
    runFrame(1000 + AUTO_SCROLL_RESUME_MS - 1);
    expect(scroller.scrollLeft).toBe(0);

    runFrame(2000 + AUTO_SCROLL_RESUME_MS);
    expect(scroller.scrollLeft).toBeGreaterThan(0);
  });

  it('ignores pointer hover that comes from touch', () => {
    const scroller = buildScroller();
    renderAutoScroll(scroller);
    intersect(true);
    runFrame(0);

    scroller.dispatchEvent(
      new PointerEvent('pointerenter', { pointerType: 'touch' }),
    );
    runFrame(1000);

    expect(scroller.scrollLeft).toBe(SPEED_PX_PER_SECOND);
  });

  it('releases a keyboard hold once focus leaves the strip', () => {
    const scroller = buildScroller();
    const tile = document.createElement('button');
    scroller.append(tile);
    renderAutoScroll(scroller);
    intersect(true);
    runFrame(0);
    vi.spyOn(tile, 'matches').mockReturnValue(true);
    vi.spyOn(performance, 'now').mockReturnValue(0);

    tile.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    runFrame(1000);
    tile.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    runFrame(2000 + AUTO_SCROLL_RESUME_MS);

    expect(scroller.scrollLeft).toBeGreaterThan(0);
  });

  it('pauses briefly when the strip is scrolled with a wheel', () => {
    const scroller = buildScroller();
    renderAutoScroll(scroller);
    intersect(true);
    runFrame(0);
    vi.spyOn(performance, 'now').mockReturnValue(0);

    scroller.dispatchEvent(new Event('wheel'));
    runFrame(AUTO_SCROLL_RESUME_MS - 1);
    expect(scroller.scrollLeft).toBe(0);

    runFrame(AUTO_SCROLL_RESUME_MS + 1000);
    expect(scroller.scrollLeft).toBeGreaterThan(0);
  });

  it('drifts without looping when there are no tiles to loop over', () => {
    const scroller = buildScroller(0);
    renderAutoScroll(scroller);
    intersect(true);
    runFrame(0);

    runFrame(4000);

    expect(scroller.scrollLeft).toBe(SPEED_PX_PER_SECOND * 4);
  });

  it('stays still while motion is paused', () => {
    document.documentElement.setAttribute(MOTION_PAUSED_ATTRIBUTE, '');
    const scroller = buildScroller();
    renderAutoScroll(scroller);

    intersect(true);

    expect(frames.pending()).toBe(0);
    document.documentElement.removeAttribute(MOTION_PAUSED_ATTRIBUTE);
  });

  it('does nothing when reduced motion is preferred', () => {
    stubReducedMotion(true);
    const scroller = buildScroller();
    renderAutoScroll(scroller);

    intersect(true);

    expect(frames.pending()).toBe(0);
  });

  it('cleans up on unmount', () => {
    const scroller = buildScroller();
    const { unmount } = renderAutoScroll(scroller);
    intersect(true);

    unmount();

    expect(frames.pending()).toBe(0);
    expect(observer.observers[0].disconnect).toHaveBeenCalled();
  });
});
