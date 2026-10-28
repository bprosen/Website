import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ENLARGE_MEDIA_LABEL, PORTRAIT } from '~/constants';
import { Portrait } from './Portrait';

const enlargeName = `${ENLARGE_MEDIA_LABEL}: ${PORTRAIT.alt}`;

describe('Portrait', () => {
  it('shows the round portrait as a button that enlarges it', () => {
    render(<Portrait className='extra' />);

    expect(screen.getByRole('button', { name: enlargeName })).toHaveClass(
      'rounded-full',
      'extra',
    );
  });

  it('requests the image at the size it is shown', () => {
    render(<Portrait size={104} />);

    expect(
      screen.getByRole('img', { name: PORTRAIT.alt }).getAttribute('sizes'),
    ).toBe('104px');
  });

  it('opens the enlarged portrait when clicked', async () => {
    const user = userEvent.setup();
    render(<Portrait />);

    await user.click(screen.getByRole('button', { name: enlargeName }));

    expect(screen.getByRole('dialog', { name: PORTRAIT.alt })).toBeVisible();
  });
});
