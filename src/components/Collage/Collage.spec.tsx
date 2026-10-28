import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Collage } from './Collage';

describe('Collage', () => {
  it('shows a wide banner with two tiles underneath', () => {
    render(
      <Collage
        label='Renatus collage'
        slots={[{ label: 'A' }, { label: 'B' }, { label: 'C' }]}
      />,
    );
    const items = within(
      screen.getByRole('list', { name: 'Renatus collage' }),
    ).getAllByRole('listitem');

    expect(items).toHaveLength(3);
    expect(items[0]).toHaveClass('col-span-2', 'aspect-[2/1]');
    expect(items[1]).toHaveClass('aspect-video');
    expect(items[2]).toHaveClass('aspect-video');
  });
});
