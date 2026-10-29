import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UNKNOWN_VISITOR, type Visitor } from '~/utils';
import { GlobeCard } from './GlobeCard';

const { useVisitor } = vi.hoisted(() => ({ useVisitor: vi.fn() }));

vi.mock('~/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/hooks')>()),
  useVisitor,
  useVisitorDots: () => [],
}));

const toronto: Visitor = {
  coords: [43.6, -79.4],
  label: 'You, near Toronto',
  sameCity: false,
};

const winnipeg: Visitor = {
  coords: null,
  label: 'You (Winnipeg)',
  sameCity: true,
};

beforeEach(() => {
  useVisitor.mockReturnValue(toronto);
});

describe('GlobeCard', () => {
  it('shows the home city and a legend', () => {
    render(<GlobeCard />);

    expect(screen.getByText('Winnipeg, Canada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Me' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'You, near Toronto' }),
    ).toBeInTheDocument();
  });

  it('toggles the home tooltip from the legend', async () => {
    render(<GlobeCard />);
    const me = screen.getByRole('button', { name: 'Me' });

    await userEvent.click(me);
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      /Ben · Winnipeg, Canada/,
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent(/It's .+ here/);
    expect(me).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(me);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('switches between markers', async () => {
    render(<GlobeCard />);

    await userEvent.click(screen.getByRole('button', { name: 'Me' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'You, near Toronto' }),
    );

    expect(screen.getByRole('tooltip')).toHaveTextContent(/km from Winnipeg/);
    expect(screen.getByRole('button', { name: 'Me' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('leaves the visitor out of the legend when they cannot be placed', () => {
    useVisitor.mockReturnValue(UNKNOWN_VISITOR);
    render(<GlobeCard />);

    expect(screen.getByRole('button', { name: 'Me' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'You' }),
    ).not.toBeInTheDocument();
  });

  it('shares the home marker with visitors from the same city', async () => {
    useVisitor.mockReturnValue(winnipeg);
    const { container } = render(<GlobeCard />);
    const you = screen.getByRole('button', { name: 'You (Winnipeg)' });

    expect(container.querySelector('[data-shared]')).toHaveClass(
      'border-coral-deep',
    );

    await userEvent.click(you);

    expect(screen.getByRole('tooltip')).toHaveTextContent(/you're here too/);
    expect(you).toHaveAttribute('aria-pressed', 'true');
  });

  it('describes the pressed legend button with the tooltip', async () => {
    render(<GlobeCard />);
    const me = screen.getByRole('button', { name: 'Me' });

    expect(me).not.toHaveAttribute('aria-describedby');

    await userEvent.click(me);

    expect(me).toHaveAccessibleDescription(/Ben · Winnipeg, Canada/);
    expect(
      screen.getByRole('button', { name: 'You, near Toronto' }),
    ).not.toHaveAttribute('aria-describedby');
  });
});
