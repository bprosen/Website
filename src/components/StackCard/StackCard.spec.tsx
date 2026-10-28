import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BRANDS, STACK_GRID } from '~/constants';
import { StackCard } from './StackCard';

describe('StackCard', () => {
  it('names every logo in the stack', () => {
    render(<StackCard />);

    expect(
      screen.getByRole('heading', { name: 'What I work with most' }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('list'))
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([...STACK_GRID]);
  });

  it('keeps the logos decorative so names are read once', () => {
    const { container } = render(<StackCard />);

    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(
      STACK_GRID.length,
    );
  });

  it('links every logo to its site', () => {
    render(<StackCard />);

    expect(
      screen.getAllByRole('link').map((link) => link.getAttribute('href')),
    ).toEqual(STACK_GRID.map((name) => BRANDS[name].url));
  });
});
