'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import type { MouseEvent } from 'react';
import { DARK_THEME_LABEL, ICON_STROKE_WIDTH } from '~/constants';
import { useTheme } from '~/hooks';
import { cn } from '~/lib/ui';
import { Switch, SwitchThumb } from '~/ui';

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
    <Switch
      aria-label={DARK_THEME_LABEL}
      checked={theme === 'dark'}
      className={cn(
        'group inline-flex min-h-11 items-center outline-none',
        className,
      )}
      onClick={handleClick}
    >
      <span className='border-border bg-accent/60 group-hover:bg-accent group-focus-visible:outline-ring relative flex h-8 w-15 items-center rounded-full border p-[3px] transition-colors duration-200 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-solid'>
        <IconSun
          aria-hidden
          className={cn(TRACK_ICON_CLASS, 'left-2')}
          stroke={ICON_STROKE_WIDTH}
        />
        <IconMoon
          aria-hidden
          className={cn(TRACK_ICON_CLASS, 'right-2')}
          stroke={ICON_STROKE_WIDTH}
        />
        <SwitchThumb className='bg-card text-foreground ring-muted-foreground ease-out-expo relative z-1 flex size-6 items-center justify-center rounded-full shadow-[0_2px_6px_rgb(0_0_0/0.18)] ring-1 transition-transform duration-300 motion-reduce:transition-none dark:translate-x-7'>
          <IconSun
            aria-hidden
            className='size-3.5 dark:hidden'
            stroke={ICON_STROKE_WIDTH}
          />
          <IconMoon
            aria-hidden
            className='hidden size-3.5 dark:block'
            stroke={ICON_STROKE_WIDTH}
          />
        </SwitchThumb>
      </span>
    </Switch>
  );
};
