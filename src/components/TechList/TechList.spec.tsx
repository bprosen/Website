import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BRANDS, NEW_TAB_HINT } from '~/constants';
import { TechList } from './TechList';

describe('TechList', () => {
  it('lists each technology with its display name', () => {
    render(<TechList items={['React', 'Tailwind']} />);
    const list = screen.getByRole('list', { name: 'Tech used' });

    expect(
      within(list)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual([`React ${NEW_TAB_HINT}`, `Tailwind CSS ${NEW_TAB_HINT}`]);
  });

  it('links each technology to its site in a new tab', () => {
    render(<TechList items={['React', 'Tailwind']} />);
    const link = screen.getByRole('link', {
      name: `Tailwind CSS ${NEW_TAB_HINT}`,
    });

    expect(link).toHaveAttribute('href', BRANDS.Tailwind.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(
      screen.getByRole('link', { name: `React ${NEW_TAB_HINT}` }),
    ).toHaveAttribute('href', BRANDS.React.url);
  });
});
