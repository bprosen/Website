import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatRow } from './StatRow';

describe('StatRow', () => {
  it('reads each value before its label', () => {
    render(<StatRow stats={[{ label: 'unique players', value: '2M+' }]} />);

    expect(screen.getByRole('listitem').textContent).toBe('2M+unique players');
  });
});
