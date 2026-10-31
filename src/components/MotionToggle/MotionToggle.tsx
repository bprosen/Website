'use client';

import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import {
  ICON_STROKE_WIDTH,
  PAUSE_MOTION_LABEL,
  RESUME_MOTION_LABEL,
} from '~/constants';
import { useMotionPaused, usePrefersReducedMotion } from '~/hooks';
import { cn } from '~/lib/ui';

type MotionToggleProps = {
  className?: string;
  labelClassName?: string;
};

export const MotionToggle = ({
  className,
  labelClassName,
}: MotionToggleProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const { paused, toggle } = useMotionPaused();

  if (reducedMotion) {
    return null;
  }

  const Icon = paused ? IconPlayerPlay : IconPlayerPause;

  return (
    <button
      className={cn('cursor-pointer', className)}
      onClick={toggle}
      type='button'
    >
      <Icon aria-hidden className='size-4' stroke={ICON_STROKE_WIDTH} />
      <span className={labelClassName}>
        {paused ? RESUME_MOTION_LABEL : PAUSE_MOTION_LABEL}
      </span>
    </button>
  );
};
