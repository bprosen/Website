import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { INTRO_LETTER_STEP_MS } from '~/constants';
import { SplitText } from './SplitText';

describe('SplitText', () => {
  it('is hidden from assistive tech so the parent can name it once', () => {
    render(
      <h1 aria-label='Ben'>
        <SplitText delayMs={0} text='Ben' />
      </h1>,
    );

    expect(screen.getByRole('heading', { name: 'Ben' })).toBeInTheDocument();
    expect(screen.getByRole('heading').textContent).toBe('Ben');
  });

  it('staggers each letter after the starting delay', () => {
    const { container } = render(<SplitText delayMs={100} text='Ben' />);
    const letters = [
      ...container.querySelectorAll('[aria-hidden] > span'),
    ] as HTMLElement[];

    expect(letters.map((letter) => letter.textContent)).toEqual([
      'B',
      'e',
      'n',
    ]);
    expect(letters.map((letter) => letter.style.animationDelay)).toEqual([
      '100ms',
      `${100 + INTRO_LETTER_STEP_MS}ms`,
      `${100 + 2 * INTRO_LETTER_STEP_MS}ms`,
    ]);
  });

  it('keeps spaces visible', () => {
    const { container } = render(<SplitText delayMs={0} text='a b' />);

    expect(
      container.querySelectorAll('[aria-hidden] > span')[1].textContent,
    ).toBe('\u00a0');
  });
});
