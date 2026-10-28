import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NOT_FOUND_ACTION, NOT_FOUND_TITLE } from '~/constants';
import NotFound, { metadata } from './not-found';

describe('not found page', () => {
  it('explains the missing page and links home', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', { level: 1, name: NOT_FOUND_TITLE }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: NOT_FOUND_ACTION }),
    ).toHaveAttribute('href', '/');
  });

  it('has its own title', () => {
    expect(metadata.title).toBe('Page not found · Ben Edgar-Prosen');
  });
});
