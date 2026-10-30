import { getDefaultNormalizer, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  EMAIL_ME_LABEL,
  FIRST_NAME,
  FULL_NAME,
  HERO_TAGLINE,
  LAST_NAME,
  PORTRAIT,
} from '~/constants';
import { Hero } from './Hero';

describe('Hero', () => {
  it('introduces the site with contact links and the globe', () => {
    render(<Hero />);

    expect(
      screen.getByRole('heading', { level: 1, name: FULL_NAME }),
    ).toHaveTextContent(`${FIRST_NAME}${LAST_NAME}`);
    expect(
      screen.getByText(HERO_TAGLINE, {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: EMAIL_ME_LABEL }),
    ).toBeInTheDocument();
    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('includes the portrait', () => {
    render(<Hero />);

    expect(screen.getByRole('img', { name: PORTRAIT.alt })).toBeInTheDocument();
  });
});
