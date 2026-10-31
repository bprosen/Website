import type { ComponentProps } from 'react';
import { cn } from '~/lib/ui';

type CardProps = ComponentProps<'div'>;

export const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      'bg-card text-card-foreground flex flex-col gap-6 rounded-[28px] border p-7',
      className,
    )}
    data-slot='card'
    {...props}
  />
);

type CardHeaderProps = ComponentProps<'div'>;

export const CardHeader = ({ className, ...props }: CardHeaderProps) => (
  <div
    className={cn('flex flex-col gap-2', className)}
    data-slot='card-header'
    {...props}
  />
);

type CardTitleProps = ComponentProps<'h3'>;

export const CardTitle = ({ className, ...props }: CardTitleProps) => (
  <h3
    className={cn(
      'm-0 font-serif text-2xl leading-tight font-semibold tracking-[-0.01em]',
      className,
    )}
    data-slot='card-title'
    {...props}
  />
);

type CardContentProps = ComponentProps<'div'>;

export const CardContent = ({ className, ...props }: CardContentProps) => (
  <div className={className} data-slot='card-content' {...props} />
);
