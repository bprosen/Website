import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LazyVideo } from './LazyVideo';

let intersect: (visible: boolean) => void = () => {};
const disconnect = vi.fn();

const setReducedMotion = (matches: boolean) =>
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      matches,
      removeEventListener: vi.fn(),
    })),
  );

beforeEach(() => {
  intersect = () => {};
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = (visible) =>
          callback(
            [{ isIntersecting: visible } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
      }
      observe = vi.fn();
      disconnect = disconnect;
    },
  );
});

const renderVideo = () =>
  render(
    <LazyVideo
      label='Parkour clip'
      poster='/poster.jpg'
      sizes='300px'
      src='/clip.mp4'
    />,
  );

describe('LazyVideo', () => {
  it('is a muted, looping, inline video that waits to load', () => {
    renderVideo();
    const video = screen.getByLabelText('Parkour clip') as HTMLVideoElement;

    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).not.toHaveAttribute('poster');
    expect(video).not.toHaveAttribute('controls');
  });

  it('plays only while on screen', () => {
    renderVideo();

    act(() => intersect(true));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);

    act(() => intersect(false));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
  });

  it('ignores browsers that block autoplay', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(
      new DOMException('blocked'),
    );
    renderVideo();

    await act(async () => intersect(true));

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it('shows controls instead of autoplaying under reduced motion', () => {
    setReducedMotion(true);
    renderVideo();

    act(() => intersect(true));

    expect(screen.getByLabelText('Parkour clip')).toHaveAttribute('controls');
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it('stops observing and pauses when unmounted', () => {
    const { unmount } = renderVideo();

    unmount();

    expect(disconnect).toHaveBeenCalled();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('shows a lazy optimized poster until the video starts playing', () => {
    const { container } = renderVideo();
    const video = screen.getByLabelText('Parkour clip');
    const poster = container.querySelector('img');

    expect(poster).toHaveAttribute('loading', 'lazy');
    expect(poster?.getAttribute('src')).toContain('poster.jpg');
    expect(video).toHaveClass('opacity-0');

    act(() => {
      video.dispatchEvent(new Event('playing'));
    });

    expect(video).toHaveClass('opacity-100');
  });

  it('keeps the video visible with controls under reduced motion', () => {
    setReducedMotion(true);
    renderVideo();

    expect(screen.getByLabelText('Parkour clip')).toHaveClass('opacity-100');
    expect(screen.getByLabelText('Parkour clip')).toHaveAttribute(
      'poster',
      '/poster.jpg',
    );
  });
});
