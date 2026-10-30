import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { MOTION_PAUSED_ATTRIBUTE, THEME_DARK_CLASS } from '~/constants';
import { stubMediaQueries } from './testing';

class ObserverStub {
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

const installStubs = () => {
  vi.stubGlobal('ResizeObserver', ObserverStub);
  vi.stubGlobal('IntersectionObserver', ObserverStub);

  if (typeof window !== 'undefined') {
    stubMediaQueries(() => false);
    Element.prototype.scrollIntoView = vi.fn();
    HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => null,
    ) as unknown as HTMLCanvasElement['getContext'];
  }
};

const resetDocument = () => {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.removeAttribute(MOTION_PAUSED_ATTRIBUTE);
  document.documentElement.classList.remove(THEME_DARK_CLASS);
};

installStubs();

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
  resetDocument();
  installStubs();
});
