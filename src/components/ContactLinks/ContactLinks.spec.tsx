import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EMAIL, GITHUB, LINKED_IN, MAILTO, RESUME_PATH } from '~/constants';
import { ContactLinks } from './ContactLinks';

describe('ContactLinks', () => {
  it('links to email, resume, GitHub and LinkedIn', () => {
    render(<ContactLinks />);

    expect(screen.getByRole('link', { name: 'Email me' })).toHaveAttribute(
      'href',
      MAILTO,
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      GITHUB,
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      LINKED_IN,
    );
  });

  it('opens the resume in a new tab', () => {
    render(<ContactLinks />);
    const resume = screen.getByRole('link', { name: 'Resume' });

    expect(resume).toHaveAttribute('href', RESUME_PATH);
    expect(resume).toHaveAttribute('target', '_blank');
    expect(resume).toHaveAttribute('rel', 'noopener');
  });

  it('spells out the address and uses dark styles in the dark tone', () => {
    render(<ContactLinks tone='dark' />);

    expect(screen.getByRole('link', { name: EMAIL })).toHaveClass('bg-accent');
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveClass(
      'border-paper/50',
    );
  });
});
