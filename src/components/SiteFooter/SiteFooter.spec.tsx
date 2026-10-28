import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CONTACT_HEADING, EMAIL, NAME } from '~/constants';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('invites contact with the full email address', () => {
    render(<SiteFooter />);

    expect(screen.getByRole('contentinfo')).toHaveAttribute('id', 'contact');
    expect(
      screen.getByRole('heading', { level: 2, name: CONTACT_HEADING }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: EMAIL })).toBeInTheDocument();
  });

  it('shows the copyright with the current year', () => {
    render(<SiteFooter />);

    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear()} ${NAME}`)),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'love' })).toBeInTheDocument();
  });
});
