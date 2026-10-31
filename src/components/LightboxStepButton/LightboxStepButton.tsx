import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import {
  ICON_STROKE_WIDTH,
  NEXT_MEDIA_LABEL,
  PREVIOUS_MEDIA_LABEL,
} from '~/constants';
import { cn } from '~/lib/ui';
import { DIALOG_ICON_BUTTON_CLASS } from '~/ui';

const STEPS = {
  next: {
    Icon: IconChevronRight,
    label: NEXT_MEDIA_LABEL,
    positionClassName: 'right-[clamp(12px,3vw,24px)]',
  },
  previous: {
    Icon: IconChevronLeft,
    label: PREVIOUS_MEDIA_LABEL,
    positionClassName: 'left-[clamp(12px,3vw,24px)]',
  },
} as const;

type LightboxStepButtonProps = {
  direction: keyof typeof STEPS;
  onClick: () => void;
};

export const LightboxStepButton = ({
  direction,
  onClick,
}: LightboxStepButtonProps) => {
  const { Icon, label, positionClassName } = STEPS[direction];

  return (
    <button
      aria-label={label}
      className={cn(
        DIALOG_ICON_BUTTON_CLASS,
        'bottom-[clamp(12px,3vw,24px)] sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2',
        positionClassName,
      )}
      onClick={onClick}
      type='button'
    >
      <Icon aria-hidden className='size-5' stroke={ICON_STROKE_WIDTH} />
    </button>
  );
};
