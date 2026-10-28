import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WORK } from '~/constants';
import { WorkNav } from './WorkNav';

describe('WorkNav', () => {
  it('links to every work entry', () => {
    render(<WorkNav entries={WORK} />);
    const nav = screen.getByRole('navigation', { name: 'Work history' });

    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['#w1', '#w2', '#w3', '#w4']);
    expect(
      within(nav).getByRole('link', { name: /Renatus Network/ }),
    ).toHaveClass('spy-w2');
  });
});
