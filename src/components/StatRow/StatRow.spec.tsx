import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatRow } from './StatRow';

describe('StatRow', () => {
  it('pairs each value with its label', () => {
    render(<StatRow stats={[{ label: 'unique players', value: '2M+' }]} />);

    expect(screen.getByRole('term')).toHaveTextContent('unique players');
    expect(screen.getByRole('definition')).toHaveTextContent('2M+');
  });
});
