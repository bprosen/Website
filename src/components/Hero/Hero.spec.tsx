import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HERO_TAGLINE, PORTRAIT } from '~/constants';
import { Hero } from './Hero';

describe('Hero', () => {
  it('introduces the site with contact links and the globe', () => {
    render(<Hero />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Ben Edgar-Prosen' }),
    ).toHaveTextContent('BenEdgar-Prosen');
    expect(screen.getByText(HERO_TAGLINE)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Email me' })).toBeInTheDocument();
    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('includes the portrait for small screens', () => {
    render(<Hero />);

    expect(screen.getByRole('img', { name: PORTRAIT.alt })).toBeInTheDocument();
  });
});
