import { useCallback, useSyncExternalStore } from 'react';
import {
  MOTION_PAUSED_ATTRIBUTE,
  MOTION_PAUSED_VALUE,
  MOTION_STORAGE_KEY,
} from '~/constants';

const writeStoredMotion = (paused: boolean) => {
  try {
    if (paused) {
      localStorage.setItem(MOTION_STORAGE_KEY, MOTION_PAUSED_VALUE);
    } else {
      localStorage.removeItem(MOTION_STORAGE_KEY);
    }
  } catch {
    return;
  }
};

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: [MOTION_PAUSED_ATTRIBUTE],
    attributes: true,
  });

  return () => observer.disconnect();
};

const getSnapshot = () =>
  document.documentElement.hasAttribute(MOTION_PAUSED_ATTRIBUTE);
const getServerSnapshot = () => false;

export const useMotionPaused = () => {
  const paused = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback(() => {
    const next = !getSnapshot();
    document.documentElement.toggleAttribute(MOTION_PAUSED_ATTRIBUTE, next);
    writeStoredMotion(next);
  }, []);

  return { paused, toggle };
};
