import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/ui';

export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        tech: 'gap-2 bg-background py-1.5 pr-3.5 pl-2.5 text-sm font-normal text-foreground [&>svg]:size-[18px]',
      },
    },
  },
);

type BadgeProps = ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

export const Badge = ({
  asChild = false,
  className,
  variant = 'default',
  ...props
}: BadgeProps) => {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      data-slot='badge'
      data-variant={variant}
      {...props}
    />
  );
};
