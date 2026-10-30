import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import {
  MOTION_PAUSED_ATTRIBUTE,
  PAUSE_MOTION_LABEL,
  RESUME_MOTION_LABEL,
} from '~/constants';
import { stubReducedMotion } from '~/lib/testing';
import { MotionToggle } from './MotionToggle';

afterEach(() => {
  localStorage.clear();
});

describe('MotionToggle', () => {
  it('pauses and resumes motion across the page', async () => {
    const user = userEvent.setup();
    render(<MotionToggle />);

    await user.click(screen.getByRole('button', { name: PAUSE_MOTION_LABEL }));

    expect(document.documentElement).toHaveAttribute(MOTION_PAUSED_ATTRIBUTE);

    await user.click(screen.getByRole('button', { name: RESUME_MOTION_LABEL }));

    expect(document.documentElement).not.toHaveAttribute(
      MOTION_PAUSED_ATTRIBUTE,
    );
    expect(
      screen.getByRole('button', { name: PAUSE_MOTION_LABEL }),
    ).toBeInTheDocument();
  });

  it('stays out of the way when the visitor already prefers reduced motion', () => {
    stubReducedMotion(true);
    render(<MotionToggle />);

    expect(
      screen.queryByRole('button', { name: PAUSE_MOTION_LABEL }),
    ).not.toBeInTheDocument();
  });
});
