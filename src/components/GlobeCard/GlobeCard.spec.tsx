import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FIRST_NAME,
  HOME_CITY,
  HOME_CITY_SHORT,
  HOME_MARKER_LABEL,
  LOCAL_TIME_PREFIX,
  LOCAL_TIME_SUFFIX,
  SAME_CITY_NOTE,
  TITLE_SEPARATOR,
  VISITOR_LABEL,
  VISITOR_LOCATING_LABEL,
  VISITOR_NEAR_LABEL,
} from '~/constants';
import type { Visitor } from '~/types';
import { UNKNOWN_VISITOR } from '~/utils';
import { GlobeCard } from './GlobeCard';

const { useVisitors } = vi.hoisted(() => ({ useVisitors: vi.fn() }));

vi.mock('~/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/hooks')>()),
  useMediaQuery: () => true,
  useVisitors,
}));

const toronto: Visitor = {
  coords: [43.6, -79.4],
  label: `${VISITOR_NEAR_LABEL} Toronto`,
  sameCity: false,
};

const winnipeg: Visitor = {
  coords: null,
  label: `${VISITOR_LABEL} (${HOME_CITY_SHORT})`,
  sameCity: true,
};

beforeEach(() => {
  useVisitors.mockReturnValue({ dots: [], loading: false, visitor: toronto });
});

describe('GlobeCard', () => {
  it('shows the home city and a legend', () => {
    render(<GlobeCard />);

    expect(screen.getByText('Winnipeg, Canada')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: HOME_MARKER_LABEL }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'You, near Toronto' }),
    ).toBeInTheDocument();
  });

  it('toggles the home tooltip from the legend', async () => {
    render(<GlobeCard />);
    const me = screen.getByRole('button', { name: HOME_MARKER_LABEL });

    await userEvent.click(me);
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      `${FIRST_NAME} · ${HOME_CITY}`,
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      new RegExp(`${LOCAL_TIME_PREFIX} .+ ${LOCAL_TIME_SUFFIX}`),
    );
    expect(me).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(me);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('switches between markers', async () => {
    render(<GlobeCard />);

    await userEvent.click(
      screen.getByRole('button', { name: HOME_MARKER_LABEL }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'You, near Toronto' }),
    );

    expect(screen.getByRole('tooltip')).toHaveTextContent(/km from Winnipeg/);
    expect(
      screen.getByRole('button', { name: HOME_MARKER_LABEL }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('leaves the visitor out of the legend when they cannot be placed', () => {
    useVisitors.mockReturnValue({
      dots: [],
      loading: false,
      visitor: UNKNOWN_VISITOR,
    });
    render(<GlobeCard />);

    expect(
      screen.getByRole('button', { name: HOME_MARKER_LABEL }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'You' }),
    ).not.toBeInTheDocument();
  });

  it('shows a disabled, unpressed placeholder while locating the visitor', async () => {
    useVisitors.mockReturnValue({
      dots: [],
      loading: true,
      visitor: UNKNOWN_VISITOR,
    });
    render(<GlobeCard />);
    const locating = screen.getByRole('button', {
      name: VISITOR_LOCATING_LABEL,
    });

    expect(locating).toBeDisabled();

    await userEvent.click(
      screen.getByRole('button', { name: HOME_MARKER_LABEL }),
    );

    expect(locating).toHaveAttribute('aria-pressed', 'false');
    expect(locating).not.toHaveAttribute('aria-describedby');
  });

  it('shares the home marker with visitors from the same city', async () => {
    useVisitors.mockReturnValue({
      dots: [],
      loading: false,
      visitor: winnipeg,
    });
    const { container } = render(<GlobeCard />);
    const you = screen.getByRole('button', {
      name: `${VISITOR_LABEL} (${HOME_CITY_SHORT})`,
    });

    expect(container.querySelector('[data-shared]')).toHaveClass(
      'border-coral-deep',
    );

    await userEvent.click(you);

    expect(screen.getByRole('tooltip')).toHaveTextContent(SAME_CITY_NOTE);
    expect(you).toHaveAttribute('aria-pressed', 'true');
  });

  it('describes the pressed legend button with the tooltip', async () => {
    render(<GlobeCard />);
    const me = screen.getByRole('button', { name: HOME_MARKER_LABEL });

    expect(me).not.toHaveAttribute('aria-describedby');

    await userEvent.click(me);

    expect(me).toHaveAccessibleDescription(
      new RegExp(`${FIRST_NAME}${TITLE_SEPARATOR}${HOME_CITY}`),
    );
    expect(
      screen.getByRole('button', { name: 'You, near Toronto' }),
    ).not.toHaveAttribute('aria-describedby');
  });
});
