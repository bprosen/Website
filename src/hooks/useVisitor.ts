import { useEffect, useState } from 'react';
import { resolveVisitor, UNKNOWN_VISITOR, type Visitor } from '~/utils';

const currentZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
};

const keepVisitorUnknown = () => {};

export const useVisitor = (): Visitor => {
  const [visitor, setVisitor] = useState<Visitor>(UNKNOWN_VISITOR);

  useEffect(() => {
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
  }, []);

  return visitor;
};
