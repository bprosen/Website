import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HERO_NAME_ID, NAME } from '~/constants';
import { HeaderHome } from './HeaderHome';

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let observe: ObserverCallback = () => {};

class FakeIntersectionObserver {
  constructor(callback: ObserverCallback) {
    observe = callback;
  }
  disconnect = vi.fn();
  observe = vi.fn();
}

describe('HeaderHome', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    const heroName = document.createElement('h1');
    heroName.id = HERO_NAME_ID;
    document.body.append(heroName);
  });

  afterEach(() => {
    document.getElementById(HERO_NAME_ID)?.remove();
  });

  it('links back to the hero with the name and headshot, hidden while the hero name is on screen', () => {
    render(<HeaderHome />);
    const link = screen.getByRole('link', { name: NAME });

    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveAttribute('data-visible', 'false');
    expect(link.querySelector('img')?.getAttribute('src')).toContain(
      'portrait.jpg',
    );
    expect(link).toHaveTextContent(NAME);
  });

  it('shows once the hero name scrolls under the header', () => {
    render(<HeaderHome />);

    act(() =>
      observe([
        {
          boundingClientRect: { top: -50 } as DOMRectReadOnly,
          isIntersecting: false,
        },
      ]),
    );

    expect(screen.getByRole('link', { name: NAME })).toHaveAttribute(
      'data-visible',
      'true',
    );
  });
});
