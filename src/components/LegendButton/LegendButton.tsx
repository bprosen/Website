import type { ReactNode } from 'react';
import { cn } from '~/lib/ui';
import { Button } from '~/ui';

type LegendButtonProps = {
  children: ReactNode;
  describedBy?: string;
  onClick: () => void;
  pressed: boolean;
  swatchClassName: string;
};

export const LegendButton = ({
  children,
  describedBy,
  onClick,
  pressed,
  swatchClassName,
}: LegendButtonProps) => (
  <Button
    aria-describedby={describedBy}
    aria-pressed={pressed}
    className='h-auto min-h-11 min-w-11 cursor-pointer gap-1.5 rounded-lg px-2 text-sm leading-snug whitespace-normal underline-offset-4 hover:translate-y-0 hover:bg-transparent hover:underline aria-pressed:underline'
    onClick={onClick}
    type='button'
    variant='ghost'
  >
    <span
      aria-hidden
      className={cn('size-2.5 rounded-full', swatchClassName)}
    />
    <span className='max-sm:sr-only'>{children}</span>
  </Button>
);
