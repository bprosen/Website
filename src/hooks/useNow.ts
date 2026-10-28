import { useSyncExternalStore } from 'react';
import { CLOCK_TICK_MS, CLOCK_TICK_SLACK_MS } from '~/constants';

const listeners = new Set<() => void>();
let now = 0;

const currentSecond = () =>
  Math.floor(Date.now() / CLOCK_TICK_MS) * CLOCK_TICK_MS;
let timer: ReturnType<typeof setTimeout> | undefined;

const schedule = () => {
  timer = setTimeout(
    () => {
      now = currentSecond();
      for (const listener of listeners) {
        listener();
      }
      schedule();
    },
    CLOCK_TICK_MS - (Date.now() % CLOCK_TICK_MS) + CLOCK_TICK_SLACK_MS,
  );
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  if (listeners.size === 1) {
    now = currentSecond();
    schedule();
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
};

const getSnapshot = () => (listeners.size > 0 ? now : currentSecond());
const getServerSnapshot = () => null;

export const useNow = (): number | null =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
