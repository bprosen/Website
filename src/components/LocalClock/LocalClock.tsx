'use client';

import { HOME_TZ } from '~/constants';
import { useNow } from '~/hooks';
import { formatClock } from '~/utils';

type LocalClockProps = {
  className?: string;
};

export const LocalClock = ({ className }: LocalClockProps) => {
  const now = useNow();

  return (
    <span className={className}>
      {now === null ? ' ' : formatClock(now, HOME_TZ)}
    </span>
  );
};
