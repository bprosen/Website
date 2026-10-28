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
        slot={{ alt: 'Spawn at sunset', label: 'Hub', src: '/hub.jpg' }}
      />,
    );

    expect(
      screen.getByRole('img', { name: 'Spawn at sunset' }),
    ).toBeInTheDocument();
  });

  it('falls back to the label for alt text', () => {
    render(
      <MediaTile sizes='100px' slot={{ label: 'Hub', src: '/hub.jpg' }} />,
    );

    expect(screen.getByRole('img', { name: 'Hub' })).toBeInTheDocument();
  });
});
