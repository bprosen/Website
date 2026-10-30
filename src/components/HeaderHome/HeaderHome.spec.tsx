import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FULL_NAME, HERO_NAME_ID } from '~/constants';
import { stubIntersectionObserver } from '~/lib/testing';
import { HeaderHome } from './HeaderHome';

let observer: ReturnType<typeof stubIntersectionObserver>;

describe('HeaderHome', () => {
  beforeEach(() => {
    observer = stubIntersectionObserver();
    const heroName = document.createElement('h1');
    heroName.id = HERO_NAME_ID;
    document.body.append(heroName);
  });

  afterEach(() => {
    document.getElementById(HERO_NAME_ID)?.remove();
  });

  it('links back to the hero with the name and headshot, hidden while the hero name is on screen', () => {
    render(<HeaderHome />);
    const link = screen.getByRole('link', { name: FULL_NAME });

    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveAttribute('data-visible', 'false');
    expect(link.querySelector('img')?.getAttribute('src')).toContain(
      'portrait.jpg',
    );
    expect(link).toHaveTextContent(FULL_NAME);
  });

  it('shows once the hero name scrolls under the header', () => {
    render(<HeaderHome />);

    act(() =>
      observer.intersect({
        boundingClientRect: { top: -50 } as DOMRectReadOnly,
        isIntersecting: false,
      }),
    );

    expect(screen.getByRole('link', { name: FULL_NAME })).toHaveAttribute(
      'data-visible',
      'true',
    );
  });
});
