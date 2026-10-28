import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BRANDS } from '~/constants';
import { TechList } from './TechList';

describe('TechList', () => {
  it('lists each technology with its display name', () => {
    render(<TechList items={['React', 'Tailwind']} />);
    const list = screen.getByRole('list', { name: 'Tech used' });

    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['React', 'Tailwind CSS']);
  });

  it('links each technology to its site in a new tab', () => {
    render(<TechList items={['React', 'Tailwind']} />);
    const link = screen.getByRole('link', { name: 'Tailwind CSS' });

    expect(link).toHaveAttribute('href', BRANDS.Tailwind.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'React' })).toHaveAttribute(
      'href',
      BRANDS.React.url,
    );
  });
});
