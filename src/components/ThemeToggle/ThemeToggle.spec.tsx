import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

afterEach(() => {
  document.documentElement.classList.remove('dark');
  localStorage.clear();
});

describe('ThemeToggle', () => {
  it('is a labeled switch that changes the theme', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const toggle = screen.getByRole('switch', { name: 'Dark theme' });

    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await user.click(toggle);

    expect(document.documentElement).toHaveClass('dark');
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    await user.click(toggle);

    expect(document.documentElement).not.toHaveClass('dark');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('keeps a 44px tap target', () => {
    render(<ThemeToggle />);

    expect(screen.getByRole('switch')).toHaveClass('min-h-11');
  });
});
