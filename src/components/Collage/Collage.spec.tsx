import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Collage } from './Collage';

describe('Collage', () => {
  it('lists tiles with the first one large', () => {
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
    expect(items[0]).toHaveClass('col-span-2', 'row-span-2');
    expect(items[1]).toHaveClass('col-span-2');
    expect(items[2]).not.toHaveClass('col-span-2');
  });
});
