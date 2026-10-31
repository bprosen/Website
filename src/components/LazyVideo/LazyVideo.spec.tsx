import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MOTION_PAUSED_ATTRIBUTE } from '~/constants';
import { stubIntersectionObserver, stubReducedMotion } from '~/lib/testing';
import { LazyVideo } from './LazyVideo';

let observer: ReturnType<typeof stubIntersectionObserver>;
const intersect = (visible: boolean) => observer.intersect(visible);

beforeEach(() => {
  observer = stubIntersectionObserver();
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

  it('does not play while motion is paused', () => {
    document.documentElement.setAttribute(MOTION_PAUSED_ATTRIBUTE, '');
    renderVideo();

    act(() => intersect(true));

    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it('does not autoplay under reduced motion', () => {
    stubReducedMotion(true);
    renderVideo();

    act(() => intersect(true));

    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it('stops observing and pauses when unmounted', () => {
    const { unmount } = renderVideo();

    unmount();

    expect(observer.observers[0].disconnect).toHaveBeenCalled();
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

  it('keeps showing the optimized poster under reduced motion', () => {
    stubReducedMotion(true);
    renderVideo();
    const video = screen.getByLabelText('Parkour clip');

    expect(video).toHaveClass('opacity-0');
    expect(video).not.toHaveAttribute('poster');
  });
});
