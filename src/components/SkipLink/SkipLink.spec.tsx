import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MAIN_CONTENT_ID, SKIP_LINK_LABEL } from '~/constants';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('jumps keyboard users straight to the main content', () => {
    render(<SkipLink />);

    expect(screen.getByRole('link', { name: SKIP_LINK_LABEL })).toHaveAttribute(
      'href',
      `#${MAIN_CONTENT_ID}`,
    );
  });
});
