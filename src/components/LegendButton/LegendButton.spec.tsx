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

  it('stays focusable but ignores clicks while disabled', async () => {
    const onClick = vi.fn();
    render(
      <LegendButton
        disabled
        onClick={onClick}
        pressed={false}
        swatchClassName='bg-coral'
      >
        You
      </LegendButton>,
    );
    const button = screen.getByRole('button', { name: 'You' });

    await userEvent.tab();
    await userEvent.click(button);

    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(onClick).not.toHaveBeenCalled();
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
});
