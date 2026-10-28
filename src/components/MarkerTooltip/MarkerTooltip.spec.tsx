import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UNKNOWN_VISITOR, type Visitor } from '~/utils';
import { MarkerTooltip } from './MarkerTooltip';

const toronto: Visitor = {
  coords: [43.6, -79.4],
  label: 'You, near Toronto',
  sameCity: false,
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-15T21:04:05.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('MarkerTooltip', () => {
  it('shows the local time on the home marker', () => {
    render(<MarkerTooltip marker='me' visitor={UNKNOWN_VISITOR} />);

    expect(screen.getByText('Ben · Winnipeg, Canada')).toBeInTheDocument();
    expect(screen.getByText('3:04:05 PM').parentElement).toHaveTextContent(
      "It's 3:04:05 PM here",
    );
  });

  it('shows the distance on the visitor marker', () => {
    render(<MarkerTooltip marker='you' visitor={toronto} />);

    expect(screen.getByText('You, near Toronto')).toBeInTheDocument();
    expect(screen.getByText(/km from Winnipeg$/)).toBeInTheDocument();
  });
});
