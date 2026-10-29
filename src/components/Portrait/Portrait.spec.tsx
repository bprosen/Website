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

  it('requests one shared image size so the photo downloads once', () => {
    render(<Portrait />);

    expect(
      screen.getByRole('img', { name: PORTRAIT.alt }).getAttribute('sizes'),
    ).toBe(PORTRAIT.sizes);
  });

  it('loads the image eagerly because it is visible wherever it appears', () => {
    render(<Portrait />);

    expect(screen.getByRole('img', { name: PORTRAIT.alt })).toHaveAttribute(
      'loading',
      'eager',
    );
  });

  it('opens the enlarged portrait when clicked', async () => {
    const user = userEvent.setup();
    render(<Portrait />);

    await user.click(screen.getByRole('button', { name: enlargeName }));

    expect(screen.getByRole('dialog', { name: PORTRAIT.alt })).toBeVisible();
  });
});
