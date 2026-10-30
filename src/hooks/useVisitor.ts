import { useEffect, useState } from 'react';
import type { Visitor } from '~/types';
import { resolveVisitor, UNKNOWN_VISITOR } from '~/utils';

const currentZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
};

const keepVisitorUnknown = () => {};

type UseVisitorOptions = {
  enabled: boolean;
};

export const useVisitor = ({ enabled }: UseVisitorOptions): Visitor => {
  const [visitor, setVisitor] = useState<Visitor>(UNKNOWN_VISITOR);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;
    const zone = currentZone();

    if (!zone) {
      return;
    }

    import('~/constants/timezones')
      .then(({ TIME_ZONES }) => {
        if (active) {
          setVisitor(resolveVisitor(zone, TIME_ZONES));
        }
      })
      .catch(keepVisitorUnknown);

    return () => {
      active = false;
    };
  }, [enabled]);

  return visitor;
};
