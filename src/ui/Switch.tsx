import { Switch as SwitchPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/ui';

type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

export const Switch = ({ className, ...props }: SwitchProps) => (
  <SwitchPrimitive.Root
    className={cn('cursor-pointer', className)}
    data-slot='switch'
    {...props}
  />
);

type SwitchThumbProps = ComponentProps<typeof SwitchPrimitive.Thumb>;

export const SwitchThumb = ({ ...props }: SwitchThumbProps) => (
  <SwitchPrimitive.Thumb data-slot='switch-thumb' {...props} />
);
