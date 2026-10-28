import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ABOUT_BIO } from '~/constants';
import { AboutSection } from './AboutSection';

describe('AboutSection', () => {
  it('shows the bio, photos and stack', () => {
    render(<AboutSection />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Get to know me' }),
    ).toBeInTheDocument();
    expect(screen.getByText(ABOUT_BIO[0])).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Photos' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'What I work with most' }),
    ).toBeInTheDocument();
  });

  it('hides the Japan note until it has text', () => {
    const { rerender } = render(<AboutSection bio={['Bio']} japanNote='' />);
    expect(screen.queryByText('Japan was great.')).not.toBeInTheDocument();

    rerender(<AboutSection bio={['Bio']} japanNote='Japan was great.' />);
    expect(screen.getByText('Japan was great.')).toBeInTheDocument();
  });
});
