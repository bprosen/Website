import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FULL_NAME } from '~/constants';
import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('links home and to each section URL', () => {
    render(<SiteHeader />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });

    expect(screen.getByRole('link', { name: FULL_NAME })).toHaveAttribute(
      'href',
      '/',
    );
    expect(
      [...nav.querySelectorAll('a')].map((link) => [
        link.textContent,
        link.getAttribute('href'),
      ]),
    ).toEqual([
      ['Work', '/work'],
      ['About', '/about'],
      ['Contact', '/contact'],
    ]);
  });

  it('has a dark theme switch', () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole('switch', { name: 'Dark theme' }),
    ).toBeInTheDocument();
  });
});
