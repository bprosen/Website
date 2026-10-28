import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LegendButton } from './LegendButton';

describe('LegendButton', () => {
  it('is a toggle button with a swatch', async () => {
    const onClick = vi.fn();
    render(
      <LegendButton
        onClick={onClick}
        pressed={false}
        swatchClassName='bg-coral'
      >
        Me
      </LegendButton>,
    );
    const button = screen.getByRole('button', { name: 'Me', pressed: false });

    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button.querySelector('.bg-coral')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('reflects the pressed state', () => {
    render(
      <LegendButton onClick={() => {}} pressed swatchClassName='bg-ink'>
        Me
      </LegendButton>,
    );

    expect(screen.getByRole('button', { pressed: true })).toBeInTheDocument();
  });

  it('keeps the label for screen readers when it is visually hidden on mobile', () => {
    render(
      <LegendButton onClick={() => {}} pressed={false} swatchClassName='bg-ink'>
        You, near Toronto
      </LegendButton>,
    );

    expect(
      screen.getByRole('button', { name: 'You, near Toronto' }),
    ).toBeInTheDocument();
    expect(screen.getByText('You, near Toronto')).toHaveClass('max-sm:sr-only');
  });

  it('shows a visible focus ring for keyboard users', () => {
    render(
      <LegendButton onClick={() => {}} pressed={false} swatchClassName='bg-ink'>
        Me
      </LegendButton>,
    );

    expect(screen.getByRole('button')).toHaveClass(
      'focus-visible:outline-solid',
    );
  });
});
