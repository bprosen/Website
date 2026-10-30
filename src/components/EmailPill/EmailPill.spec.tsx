import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EMAIL, EMAIL_HREF } from '~/constants';
import { EmailPill } from './EmailPill';

describe('EmailPill', () => {
  it('links to email with the full address', () => {
    render(<EmailPill />);

    expect(screen.getByRole('link', { name: EMAIL })).toHaveAttribute(
      'href',
      EMAIL_HREF,
    );
  });

  it('copies the address from inside the same pill and announces it', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');
    render(<EmailPill />);

    await user.click(
      screen.getByRole('button', { name: 'Copy email address' }),
    );

    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(await screen.findByText('Email address copied')).toBeInTheDocument();
  });
});
