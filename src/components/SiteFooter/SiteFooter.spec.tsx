import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  CONTACT_HEADING,
  EMAIL,
  FULL_NAME,
  HEART_LABEL,
  NEW_TAB_HINT,
  PAUSE_MOTION_LABEL,
  SITE_REPO_URL,
  VIEW_SOURCE_LABEL,
} from '~/constants';
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
      screen.getByText(
        new RegExp(`© ${new Date().getFullYear()} ${FULL_NAME}`),
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: HEART_LABEL })).toBeInTheDocument();
  });

  it('links to the site source', () => {
    render(<SiteFooter />);
    const link = screen.getByRole('link', {
      name: `${VIEW_SOURCE_LABEL} ${NEW_TAB_HINT}`,
    });

    expect(link).toHaveAttribute('href', SITE_REPO_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('offers a way to pause the page motion', () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole('button', { name: PAUSE_MOTION_LABEL }),
    ).toBeInTheDocument();
  });
});
