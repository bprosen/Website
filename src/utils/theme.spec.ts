import { afterEach, describe, expect, it, vi } from 'vitest';
import { THEME_STORAGE_KEY } from '~/constants';
import {
  isDarkBrand,
  isTheme,
  oppositeTheme,
  relativeLuminance,
  resolveTheme,
  revealClipPath,
  revealRadius,
  themeInitScript,
} from './theme';

afterEach(() => {
  document.documentElement.classList.remove('dark');
  localStorage.clear();
  vi.unstubAllGlobals();
});

const runInitScript = (prefersDark: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: prefersDark })),
  );
  new Function(themeInitScript())();
  return document.documentElement.classList.contains('dark');
};

describe('isTheme / oppositeTheme', () => {
  it('recognises the two themes', () => {
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('light')).toBe(true);
    expect(isTheme('blue')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it('flips between them', () => {
    expect(oppositeTheme('dark')).toBe('light');
    expect(oppositeTheme('light')).toBe('dark');
  });
});

describe('resolveTheme', () => {
  it('prefers a stored choice', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('follows the system without a valid stored choice', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme('nonsense', false)).toBe('light');
  });
});

describe('themeInitScript', () => {
  it('follows the system preference on a first visit', () => {
    expect(runInitScript(true)).toBe(true);
    document.documentElement.classList.remove('dark');
    expect(runInitScript(false)).toBe(false);
  });

  it('applies a stored choice over the system preference', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(runInitScript(true)).toBe(false);

    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(runInitScript(false)).toBe(true);
  });

  it('never throws when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(() => runInitScript(true)).not.toThrow();
  });
});

describe('revealRadius / revealClipPath', () => {
  it('reaches the farthest corner from the origin', () => {
    expect(revealRadius(0, 0, 300, 400)).toBe(500);
    expect(revealRadius(300, 400, 300, 400)).toBe(500);
    expect(revealRadius(150, 200, 300, 400)).toBe(250);
  });

  it('grows a circle from nothing to the radius', () => {
    expect(revealClipPath(10, 20, 500)).toEqual([
      'circle(0px at 10px 20px)',
      'circle(500px at 10px 20px)',
    ]);
  });
});

describe('relativeLuminance / isDarkBrand', () => {
  it('measures black and white', () => {
    expect(relativeLuminance('#000000')).toBe(0);
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1);
  });

  it('flags logos that would vanish on a dark background', () => {
    expect(isDarkBrand('#000000')).toBe(true);
    expect(isDarkBrand('#181717')).toBe(true);
    expect(isDarkBrand('#61DAFB')).toBe(false);
    expect(isDarkBrand('#3178C6')).toBe(false);
  });
});
