import { useEffect, useState } from 'react';
import { recordVisit } from '~/api';
import {
  VISITORS_IDLE_FALLBACK_MS,
  VISITORS_IDLE_TIMEOUT_MS,
} from '~/constants';
import type { LatLon, Visitor } from '~/types';
import { resolveVisitor, UNKNOWN_VISITOR } from '~/utils';

type Visitors = {
  dots: readonly LatLon[];
  loading: boolean;
  visitor: Visitor;
};

const NO_DOTS: readonly LatLon[] = [];
const LOADING: Visitors = {
  dots: NO_DOTS,
  loading: true,
  visitor: UNKNOWN_VISITOR,
};
const NOTHING_FOUND: Visitors = { ...LOADING, loading: false };

export const useVisitors = (): Visitors => {
  const [visitors, setVisitors] = useState<Visitors>(LOADING);

  useEffect(() => {
    if (navigator.webdriver) {
      setVisitors(NOTHING_FOUND);
      return;
    }

    const controller = new AbortController();
    const load = () => {
      recordVisit(controller.signal).then(({ dots, location }) => {
        if (controller.signal.aborted) {
          return;
        }

        setVisitors(
          dots.length === 0 && !location
            ? NOTHING_FOUND
            : {
                dots: dots.length > 0 ? dots : NO_DOTS,
                loading: false,
                visitor: resolveVisitor(location),
              },
        );
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

  return visitors;
};
