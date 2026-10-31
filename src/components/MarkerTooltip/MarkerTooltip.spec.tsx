import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FIRST_NAME,
  HOME_CITY,
  LOCAL_TIME_PREFIX,
  LOCAL_TIME_SUFFIX,
} from '~/constants';
import type { Visitor } from '~/types';
import { UNKNOWN_VISITOR } from '~/utils';
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
    render(<MarkerTooltip marker='home' visitor={UNKNOWN_VISITOR} />);

    expect(
      screen.getByText(`${FIRST_NAME} · ${HOME_CITY}`),
    ).toBeInTheDocument();
    expect(screen.getByText('3:04:05 PM').parentElement).toHaveTextContent(
      `${LOCAL_TIME_PREFIX} 3:04:05 PM ${LOCAL_TIME_SUFFIX}`,
    );
  });

  it('shows the distance on the visitor marker', () => {
    render(<MarkerTooltip marker='visitor' visitor={toronto} />);

    expect(screen.getByText('You, near Toronto')).toBeInTheDocument();
    expect(screen.getByText(/km from Winnipeg$/)).toBeInTheDocument();
  });
});
