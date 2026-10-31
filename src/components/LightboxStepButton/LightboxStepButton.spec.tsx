import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NEXT_MEDIA_LABEL, PREVIOUS_MEDIA_LABEL } from '~/constants';
import { LightboxStepButton } from './LightboxStepButton';

describe('LightboxStepButton', () => {
  it('labels each direction for screen readers', () => {
    render(
      <>
        <LightboxStepButton direction='previous' onClick={vi.fn()} />
        <LightboxStepButton direction='next' onClick={vi.fn()} />
      </>,
    );

    expect(
      screen.getByRole('button', { name: PREVIOUS_MEDIA_LABEL }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: NEXT_MEDIA_LABEL }),
    ).toBeInTheDocument();
  });

  it('calls back when pressed', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<LightboxStepButton direction='next' onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: NEXT_MEDIA_LABEL }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
