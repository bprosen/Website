import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/ui';

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap no-underline outline-none transition-[background-color,border-color,color,translate] duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[22px]",
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-12 px-[22px]',
        icon: 'size-12',
        iconLg: 'size-13',
        lg: 'h-13 px-[26px]',
        nav: 'min-h-11 px-4 text-base',
      },
      variant: {
        accent:
          'bg-accent font-semibold text-accent-foreground focus-visible:ring-inverse-foreground/60',
        default: 'bg-primary text-primary-foreground',
        ghost: 'font-normal hover:translate-y-0 hover:bg-accent',
        outline:
          'border-[1.5px] border-foreground text-foreground hover:bg-accent',
        outlineDark:
          'border-[1.5px] border-inverse-foreground/50 text-inverse-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-inverse-foreground/60',
      },
    },
  },
);

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = ({
  asChild = false,
  className,
  size = 'default',
  variant = 'default',
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ className, size, variant }))}
      data-size={size}
      data-slot='button'
      data-variant={variant}
      {...props}
    />
  );
};
