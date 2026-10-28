import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
