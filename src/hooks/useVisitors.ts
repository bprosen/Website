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
  visitor: Visitor;
};

const NO_DOTS: readonly LatLon[] = [];
const NO_VISITORS: Visitors = { dots: NO_DOTS, visitor: UNKNOWN_VISITOR };

export const useVisitors = (): Visitors => {
  const [visitors, setVisitors] = useState<Visitors>(NO_VISITORS);

  useEffect(() => {
    if (navigator.webdriver) {
      return;
    }

    const controller = new AbortController();
    const load = () => {
      recordVisit(controller.signal).then(({ dots, location }) => {
        if (controller.signal.aborted || (dots.length === 0 && !location)) {
          return;
        }

        setVisitors({
          dots: dots.length > 0 ? dots : NO_DOTS,
          visitor: resolveVisitor(location),
        });
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
