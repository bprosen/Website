import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  FULL_NAME,
  NOT_FOUND_HEADING,
  NOT_FOUND_LINK_LABEL,
  NOT_FOUND_PAGE_TITLE,
  TITLE_SEPARATOR,
} from '~/constants';
import NotFound, { metadata } from './not-found';

describe('not found page', () => {
  it('explains the missing page and links home', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', { level: 1, name: NOT_FOUND_HEADING }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: NOT_FOUND_LINK_LABEL }),
    ).toHaveAttribute('href', '/');
  });

  it('has its own title', () => {
    expect(metadata.title).toBe(
      `${NOT_FOUND_PAGE_TITLE}${TITLE_SEPARATOR}${FULL_NAME}`,
    );
  });
});
