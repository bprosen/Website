import { Separator as SeparatorPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/ui';

type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root>;

export const Separator = ({
  className,
  decorative = true,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) => (
  <SeparatorPrimitive.Root
    className={cn(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      className,
    )}
    data-slot='separator'
    decorative={decorative}
    orientation={orientation}
    {...props}
  />
);
