import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NEW_TAB_HINT, PDF_NEW_TAB_HINT } from '~/constants';
import { NewTabHint } from './NewTabHint';

describe('NewTabHint', () => {
  it('tells screen reader users that a link opens a new tab', () => {
    render(
      <a href='https://example.com'>
        Docs
        <NewTabHint />
      </a>,
    );

    expect(
      screen.getByRole('link', { name: `Docs ${NEW_TAB_HINT}` }),
    ).toBeInTheDocument();
  });

  it('accepts a more specific hint', () => {
    render(
      <a href='/file.pdf'>
        File
        <NewTabHint hint={PDF_NEW_TAB_HINT} />
      </a>,
    );

    expect(
      screen.getByRole('link', { name: `File ${PDF_NEW_TAB_HINT}` }),
    ).toBeInTheDocument();
  });
});
