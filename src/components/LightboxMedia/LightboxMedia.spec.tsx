import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LightboxMedia } from './LightboxMedia';

const FUJI = {
  alt: 'Mt. Fuji',
  height: 1600,
  src: '/fuji.jpg',
  tint: 'red',
  width: 1200,
};
const CASTLE = {
  alt: 'Osaka Castle',
  height: 900,
  src: '/castle.jpg',
  width: 1600,
};
const CLIP = {
  alt: 'Parkour clip',
  height: 450,
  src: '/clip.jpg',
  video: '/clip.mp4',
  width: 800,
};

const preloadLinks = () => [
  ...document.head.querySelectorAll<HTMLLinkElement>(
    'link[rel="preload"][as="image"]',
  ),
];

describe('LightboxMedia', () => {
  afterEach(() => {
    for (const link of preloadLinks()) {
      link.remove();
    }
  });

  it('fills the frame with the tint until the photo loads', () => {
    render(<LightboxMedia hasControls={false} item={FUJI} neighbours={[]} />);

    expect(screen.getByRole('presentation')).toHaveStyle({
      aspectRatio: '1200 / 1600',
      backgroundColor: 'rgb(255, 0, 0)',
    });
  });

  it('plays a video with its poster', () => {
    const { container } = render(
      <LightboxMedia hasControls={false} item={CLIP} neighbours={[]} />,
    );

    expect(container.querySelector('video')).toHaveAttribute(
      'poster',
      CLIP.src,
    );
  });

  it('preloads neighbouring photos at the size they will be shown', () => {
    render(
      <LightboxMedia hasControls item={FUJI} neighbours={[CASTLE, CLIP]} />,
    );
    const [castle, clip] = preloadLinks();

    expect(castle?.getAttribute('imagesrcset')).toContain('castle.jpg');
    expect(castle?.getAttribute('imagesizes')).toContain('(min-width: 640px)');
    expect(clip).toHaveAttribute('href', CLIP.src);
  });

  it('preloads nothing without neighbours', () => {
    render(<LightboxMedia hasControls={false} item={FUJI} neighbours={[]} />);

    expect(preloadLinks()).toHaveLength(0);
  });
});
