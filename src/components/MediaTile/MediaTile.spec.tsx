import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MediaTile } from './MediaTile';

describe('MediaTile', () => {
  it('shows a captioned placeholder without a photo', () => {
    render(
      <MediaTile
        sizes='100px'
        slot={{ label: 'Community event', tint: 'red' }}
      />,
    );

    expect(screen.getByRole('figure')).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)',
    });
    expect(screen.getByText('Community event').tagName).toBe('FIGCAPTION');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows the photo with its alt text once it has a source', () => {
    render(
      <MediaTile
        sizes='100px'
        slot={{
          alt: 'Spawn at sunset',
          height: 300,
          label: 'Hub',
          src: '/hub.jpg',
          width: 400,
        }}
      />,
    );

    expect(
      screen.getByRole('img', { name: 'Spawn at sunset' }),
    ).toBeInTheDocument();
  });

  it('falls back to the label for alt text', () => {
    render(
      <MediaTile
        sizes='100px'
        slot={{ height: 300, label: 'Hub', src: '/hub.jpg', width: 400 }}
      />,
    );

    expect(screen.getByRole('img', { name: 'Hub' })).toBeInTheDocument();
  });

  it('crops from the top when the slot asks for it', () => {
    render(
      <MediaTile
        sizes='100px'
        slot={{
          alt: 'Pagoda',
          focus: 'top',
          height: 300,
          label: 'Pagoda',
          src: '/p.jpg',
          width: 400,
        }}
      />,
    );

    expect(screen.getByRole('img', { name: 'Pagoda' })).toHaveClass(
      'object-top',
    );
  });

  it('crops from the centre by default', () => {
    render(
      <MediaTile
        sizes='100px'
        slot={{ height: 300, label: 'Hub', src: '/hub.jpg', width: 400 }}
      />,
    );

    expect(screen.getByRole('img', { name: 'Hub' })).not.toHaveClass(
      'object-top',
    );
  });

  it('plays a lazy video with the image as its poster', () => {
    render(
      <MediaTile
        sizes='100px'
        slot={{
          alt: 'Parkour clip',
          height: 450,
          label: 'Clip',
          src: '/poster.jpg',
          video: '/clip.mp4',
          width: 800,
        }}
      />,
    );
    const video = screen.getByLabelText('Parkour clip');

    expect(video.tagName).toBe('VIDEO');
    expect(video).toHaveAttribute('src', '/clip.mp4');
  });
});
