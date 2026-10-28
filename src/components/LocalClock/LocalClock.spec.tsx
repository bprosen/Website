import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalClock } from './LocalClock';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-15T21:04:05.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('LocalClock', () => {
  it('renders a placeholder on the server', () => {
    expect(renderToString(<LocalClock />)).toBe('<span> </span>');
  });

  it('shows and ticks Winnipeg time in the browser', () => {
    render(<LocalClock className='clock' />);

    expect(screen.getByText('3:04:05 PM')).toHaveClass('clock');

    act(() => vi.advanceTimersByTime(1010));
    expect(screen.getByText('3:04:06 PM')).toBeInTheDocument();
  });
});
