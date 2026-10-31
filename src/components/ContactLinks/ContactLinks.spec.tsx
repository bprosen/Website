import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  EMAIL,
  EMAIL_HREF,
  GITHUB_URL,
  LINKEDIN_URL,
  NEW_TAB_HINT,
  PDF_NEW_TAB_HINT,
  RESUME_PATH,
} from '~/constants';
import { ContactLinks } from './ContactLinks';

describe('ContactLinks', () => {
  it('links to email, resume, GitHub and LinkedIn', () => {
    render(<ContactLinks />);

    expect(screen.getByRole('link', { name: 'Email me' })).toHaveAttribute(
      'href',
      EMAIL_HREF,
    );
    expect(
      screen.getByRole('link', { name: `GitHub ${NEW_TAB_HINT}` }),
    ).toHaveAttribute('href', GITHUB_URL);
    expect(
      screen.getByRole('link', { name: `LinkedIn ${NEW_TAB_HINT}` }),
    ).toHaveAttribute('href', LINKEDIN_URL);
  });

  it('opens the resume in a new tab', () => {
    render(<ContactLinks />);
    const resume = screen.getByRole('link', {
      name: `Resume ${PDF_NEW_TAB_HINT}`,
    });

    expect(resume).toHaveAttribute('href', RESUME_PATH);
    expect(resume).toHaveAttribute('target', '_blank');
    expect(resume).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('spells out the address and uses dark styles in the dark tone', () => {
    render(<ContactLinks tone='dark' />);

    expect(screen.getByRole('link', { name: EMAIL })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: `Resume ${PDF_NEW_TAB_HINT}` }),
    ).toHaveClass('border-inverse-foreground/50');
  });

  it('offers to copy the email only in the footer tone', () => {
    const { unmount } = render(<ContactLinks tone='dark' />);
    expect(
      screen.getByRole('button', { name: 'Copy email address' }),
    ).toBeInTheDocument();
    unmount();

    render(<ContactLinks />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
