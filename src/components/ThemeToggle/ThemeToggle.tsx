'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import type { MouseEvent } from 'react';
import { ICON_STROKE } from '~/constants';
import { useTheme } from '~/hooks';
import { cn } from '~/lib/ui';

type ThemeToggleProps = {
  className?: string;
};

const TRACK_ICON_CLASS =
  'absolute top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground';

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggle } = useTheme();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <button
      aria-checked={theme === 'dark'}
      aria-label='Dark theme'
      className={cn(
        'group inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent p-0 outline-none',
        className,
      )}
      onClick={handleClick}
      role='switch'
      type='button'
    >
      <span className='relative flex h-8 w-15 items-center rounded-full border border-border bg-accent/60 p-[3px] transition-colors duration-200 group-hover:bg-accent group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50'>
        <IconSun
          aria-hidden
          className={cn(TRACK_ICON_CLASS, 'left-2')}
          stroke={ICON_STROKE}
        />
        <IconMoon
          aria-hidden
          className={cn(TRACK_ICON_CLASS, 'right-2')}
          stroke={ICON_STROKE}
        />
        <span className='relative z-1 flex size-6 items-center justify-center rounded-full bg-card text-foreground shadow-[0_2px_6px_rgb(0_0_0/0.18)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:translate-x-7'>
          <IconSun
            aria-hidden
            className='size-3.5 dark:hidden'
            stroke={ICON_STROKE}
          />
          <IconMoon
            aria-hidden
            className='hidden size-3.5 dark:block'
            stroke={ICON_STROKE}
          />
        </span>
      </span>
    </button>
  );
};
