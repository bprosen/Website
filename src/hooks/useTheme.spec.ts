import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { THEME_STORAGE_KEY } from '~/constants';
import { useTheme } from './useTheme';

let systemListener: () => void = () => {};
let prefersDark = false;
let reducedMotion = false;

beforeEach(() => {
  document.documentElement.classList.remove('dark');
  localStorage.clear();
  prefersDark = false;
  reducedMotion = false;
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      addEventListener: (_: string, listener: () => void) => {
        if (query.includes('color-scheme')) {
          systemListener = listener;
        }
      },
      get matches() {
        return query.includes('reduced-motion') ? reducedMotion : prefersDark;
      },
      removeEventListener: vi.fn(),
    })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  Reflect.deleteProperty(document, 'startViewTransition');
});

describe('useTheme', () => {
  it('reads the theme from the page', () => {
    document.documentElement.classList.add('dark');
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
  });

  it('toggles and remembers the choice', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => result.current.toggle());

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    await act(async () => result.current.toggle());

    expect(result.current.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('reveals the new theme with a view transition from the origin', async () => {
    const animate = vi.fn();
    document.documentElement.animate = animate;
    const startViewTransition = vi.fn((update: () => void) => {
      update();
      return { ready: Promise.resolve() };
    });
    Object.assign(document, { startViewTransition });
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 800);
    const { result } = renderHook(() => useTheme());

    await act(async () => result.current.toggle({ x: 1000, y: 0 }));

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(document.documentElement).toHaveClass('dark');
    expect(animate).toHaveBeenCalledWith(
      {
        clipPath: [
          'circle(0px at 1000px 0px)',
          `circle(${Math.hypot(1000, 800)}px at 1000px 0px)`,
        ],
      },
      expect.objectContaining({ pseudoElement: '::view-transition-new(root)' }),
    );
  });

  it('switches instantly under reduced motion', async () => {
    reducedMotion = true;
    const startViewTransition = vi.fn();
    Object.assign(document, { startViewTransition });
    const { result } = renderHook(() => useTheme());

    await act(async () => result.current.toggle({ x: 0, y: 0 }));

    expect(startViewTransition).not.toHaveBeenCalled();
    expect(document.documentElement).toHaveClass('dark');
  });

  it('follows system changes until the visitor picks a theme', async () => {
    renderHook(() => useTheme());

    prefersDark = true;
    await act(async () => systemListener());
    expect(document.documentElement).toHaveClass('dark');

    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    prefersDark = false;
    await act(async () => systemListener());
    expect(document.documentElement).toHaveClass('dark');
  });

  it('still switches when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(() => useTheme());

    await act(async () => result.current.toggle());

    expect(document.documentElement).toHaveClass('dark');
  });
});
