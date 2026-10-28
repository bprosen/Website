import type { ReactNode } from 'react';

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
  <button
    aria-describedby={describedBy}
    aria-pressed={pressed}
    className='inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 text-left leading-snug rounded-lg border-0 bg-transparent px-2 font-[inherit] text-inherit underline-offset-4 outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink'
    onClick={onClick}
    type='button'
  >
    <span aria-hidden className={`size-2.5 rounded-full ${swatchClassName}`} />
    <span className='max-sm:sr-only'>{children}</span>
  </button>
);
