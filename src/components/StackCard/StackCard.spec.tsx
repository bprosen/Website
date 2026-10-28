import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { STACK_GRID } from '~/constants';
import { StackCard } from './StackCard';

describe('StackCard', () => {
  it('shows every stack logo with a name', () => {
    render(<StackCard />);

    expect(
      screen.getByRole('heading', { name: 'What I work with most' }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('img').map((icon) => icon.getAttribute('aria-label')),
    ).toEqual([...STACK_GRID]);
  });
});
