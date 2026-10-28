import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WORK } from '~/constants';
import { WorkEntry } from './WorkEntry';

const [taiv, renatus] = WORK;

describe('WorkEntry', () => {
  it('shows the role, stats, summary and tech', () => {
    render(<WorkEntry entry={taiv} first />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Taiv' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByText('Billions')).toBeInTheDocument();
    expect(screen.getByText(taiv.summary)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Tech used' })).toBeInTheDocument();
  });

  it('is an anchor target and a scroll-spy timeline', () => {
    const { container } = render(<WorkEntry entry={taiv} first />);

    expect(container.querySelector('#w1')).toBeInTheDocument();
    expect(container.querySelector('.w1')).toHaveClass('pb-16');
  });

  it('adds a collage when the entry has one', () => {
    render(<WorkEntry entry={renatus} last />);

    expect(
      screen.getByRole('list', { name: 'Renatus Network collage' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveClass('pt-16');
  });
});
