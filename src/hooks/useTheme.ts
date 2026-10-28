import { useCallback, useSyncExternalStore } from 'react';
import {
  DARK_SCHEME_QUERY,
  REDUCED_MOTION_QUERY,
  THEME_DARK_CLASS,
  THEME_REVEAL_EASING,
  THEME_REVEAL_MS,
  THEME_STORAGE_KEY,
} from '~/constants';
import {
  oppositeTheme,
  resolveTheme,
  revealClipPath,
  revealRadius,
  type Theme,
} from '~/utils';

const readStored = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeStored = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    return;
  }
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle(THEME_DARK_CLASS, theme === 'dark');
};

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: ['class'],
    attributes: true,
  });

  const system = window.matchMedia(DARK_SCHEME_QUERY);
  const onSystemChange = () => {
    if (readStored() === null) {
      applyTheme(resolveTheme(null, system.matches));
    }
  };
  system.addEventListener('change', onSystemChange);

  return () => {
    observer.disconnect();
    system.removeEventListener('change', onSystemChange);
  };
};

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains(THEME_DARK_CLASS)
    ? 'dark'
    : 'light';

const getServerSnapshot = (): Theme => 'light';

const revealFrom = (origin: { x: number; y: number } | undefined) => {
  if (!origin) {
    return;
  }

  const radius = revealRadius(
    origin.x,
    origin.y,
    window.innerWidth,
    window.innerHeight,
  );

  document.documentElement.animate(
    { clipPath: revealClipPath(origin.x, origin.y, radius) },
    {
      duration: THEME_REVEAL_MS,
      easing: THEME_REVEAL_EASING,
      pseudoElement: '::view-transition-new(root)',
    },
  );
};

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next = oppositeTheme(getSnapshot());
    const commit = () => {
      applyTheme(next);
      writeStored(next);
    };

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    if (reducedMotion || typeof document.startViewTransition !== 'function') {
      commit();
      return;
    }

    document
      .startViewTransition(commit)
      .ready.then(() => revealFrom(origin))
      .catch(commit);
  }, []);

  return { theme, toggle };
};
