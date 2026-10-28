import type { CSSProperties } from 'react';
import { INTRO_LETTER_STEP_MS } from '~/constants';

type SplitTextProps = {
  delayMs: number;
  text: string;
};

const letterDelay = (delayMs: number, index: number): CSSProperties => ({
  animationDelay: `${delayMs + index * INTRO_LETTER_STEP_MS}ms`,
});

export const SplitText = ({ delayMs, text }: SplitTextProps) => (
  <span aria-hidden='true'>
    {[...text].map((letter, index) => (
      <span
        className='inline-block origin-bottom-left motion-safe:animate-intro-letter'
        // biome-ignore lint/suspicious/noArrayIndexKey: letters repeat, so their position in the fixed string is their identity.
        key={index}
        style={letterDelay(delayMs, index)}
      >
        {letter === ' ' ? '\u00a0' : letter}
      </span>
    ))}
  </span>
);
