import { useEffect, useState } from 'react';
import { recordVisit } from '~/api';
import {
  VISITORS_IDLE_FALLBACK_MS,
  VISITORS_IDLE_TIMEOUT_MS,
} from '~/constants';
import type { LatLon } from '~/types';

const NO_DOTS: readonly LatLon[] = [];

export const useVisitorDots = (): readonly LatLon[] => {
  const [dots, setDots] = useState<readonly LatLon[]>(NO_DOTS);

  useEffect(() => {
    const controller = new AbortController();
    const load = () => {
      recordVisit(controller.signal).then((visitors) => {
        if (!controller.signal.aborted && visitors.length > 0) {
          setDots(visitors);
        }
      });
    };

    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(load, {
        timeout: VISITORS_IDLE_TIMEOUT_MS,
      });

      return () => {
        window.cancelIdleCallback(handle);
        controller.abort();
      };
    }

    const timer = setTimeout(load, VISITORS_IDLE_FALLBACK_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return dots;
};
