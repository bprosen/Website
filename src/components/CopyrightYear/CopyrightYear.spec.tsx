import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CopyrightYear } from './CopyrightYear';

afterEach(() => {
  vi.useRealTimers();
});

describe('CopyrightYear', () => {
  it("shows the visitor's current year, not the year the page was built", () => {
    vi.useFakeTimers({ now: new Date('2031-01-02T00:00:00Z') });
    render(<CopyrightYear />);

    expect(screen.getByText('2031')).toBeInTheDocument();
  });
});
