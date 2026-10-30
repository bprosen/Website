import { useSyncExternalStore } from 'react';
import { CLOCK_TICK_MS, CLOCK_TICK_SLACK_MS } from '~/constants';

const listeners = new Set<() => void>();
let now = 0;
let timer: ReturnType<typeof setTimeout> | undefined;

const currentTickMs = () =>
  Math.floor(Date.now() / CLOCK_TICK_MS) * CLOCK_TICK_MS;

const schedule = () => {
  timer = setTimeout(
    () => {
      now = currentTickMs();
      for (const listener of listeners) {
        listener();
      }
      schedule();
    },
    CLOCK_TICK_MS - (Date.now() % CLOCK_TICK_MS) + CLOCK_TICK_SLACK_MS,
  );
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);

  if (listeners.size === 1) {
    now = currentTickMs();
    schedule();
  }

  return () => {
    listeners.delete(onChange);

    if (listeners.size === 0) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
};

const getSnapshot = () => (listeners.size > 0 ? now : currentTickMs());
const getServerSnapshot = () => null;

export const useNow = (): number | null =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
