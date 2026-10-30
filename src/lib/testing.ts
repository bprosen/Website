import { type Mock, vi } from 'vitest';
import { REDUCED_MOTION_QUERY } from '~/constants';

type FakeIntersectionObserver = {
  callback: IntersectionObserverCallback;
  disconnect: Mock;
  observe: Mock;
  options?: IntersectionObserverInit;
  unobserve: Mock;
};

type EntryInit = Partial<IntersectionObserverEntry>;

export const stubIntersectionObserver = () => {
  const observers: FakeIntersectionObserver[] = [];

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      disconnect = vi.fn();
      observe = vi.fn();
      takeRecords = vi.fn(() => []);
      unobserve = vi.fn();

      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        observers.push({
          callback,
          disconnect: this.disconnect,
          observe: this.observe,
          options,
          unobserve: this.unobserve,
        });
      }
    },
  );

  const intersect = (
    entries: boolean | EntryInit | EntryInit[],
    observer = observers.at(-1),
  ) => {
    const list =
      typeof entries === 'boolean'
        ? [{ isIntersecting: entries }]
        : Array.isArray(entries)
          ? entries
          : [entries];

    observer?.callback(
      list as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
  };

  return { intersect, observers };
};

export const stubAnimationFrames = () => {
  let queued: FrameRequestCallback[] = [];

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      queued.push(callback);
      return queued.length;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn(() => {
      queued = [];
    }),
  );

  return {
    pending: () => queued.length,
    run: (time = performance.now() + 16) => {
      const callbacks = queued;
      queued = [];
      for (const callback of callbacks) {
        callback(time);
      }
    },
  };
};

export const stubMediaQueries = (matches: (query: string) => boolean) =>
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      matches: matches(query),
      media: query,
      removeEventListener: vi.fn(),
    })),
  );

export const stubReducedMotion = (reduced: boolean) =>
  stubMediaQueries((query) => query === REDUCED_MOTION_QUERY && reduced);

export const stubFetchJson = (body: unknown, status = 200) => {
  const fetchMock = vi.fn<typeof fetch>(
    async () => new Response(JSON.stringify(body), { status }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};
