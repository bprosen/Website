import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch, SwitchThumb } from './Switch';

describe('Switch', () => {
  it('is a labeled switch that reports changes', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch aria-label='Wi-Fi' onCheckedChange={onCheckedChange}>
        <SwitchThumb />
      </Switch>,
    );
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' });

    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await user.click(toggle);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });
});
