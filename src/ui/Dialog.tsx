import { IconX } from '@tabler/icons-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import type { ComponentProps, ReactNode } from 'react';
import { CLOSE_DIALOG_LABEL, ICON_STROKE_WIDTH } from '~/constants';
import { cn } from '~/lib/ui';

export const DIALOG_ICON_BUTTON_CLASS =
  'bg-background/85 text-foreground hover:bg-background absolute inline-flex size-11 cursor-pointer items-center justify-center rounded-full border-0 shadow-[0_6px_16px_rgb(23_32_26/0.25)] transition-[background-color,scale] duration-200 [--ring:var(--inverse-foreground)] hover:scale-105';

type DialogProps = ComponentProps<typeof DialogPrimitive.Root>;

export const Dialog = ({ ...props }: DialogProps) => (
  <DialogPrimitive.Root data-slot='dialog' {...props} />
);

type DialogTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;

export const DialogTrigger = ({ ...props }: DialogTriggerProps) => (
  <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />
);

type DialogTitleProps = ComponentProps<typeof DialogPrimitive.Title>;

export const DialogTitle = ({ ...props }: DialogTitleProps) => (
  <DialogPrimitive.Title data-slot='dialog-title' {...props} />
);

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  controls?: ReactNode;
};

export const DialogContent = ({
  children,
  className,
  controls,
  ...props
}: DialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      className='bg-inverse/55 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-100 backdrop-blur-lg motion-reduce:animate-none'
      data-slot='dialog-overlay'
    />
    <DialogPrimitive.Content
      aria-describedby={undefined}
      className={cn(
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed inset-0 z-100 flex items-center justify-center p-[clamp(16px,4vw,48px)] outline-none motion-reduce:animate-none',
        className,
      )}
      data-slot='dialog-content'
      {...props}
    >
      <DialogPrimitive.Close
        aria-hidden
        className='absolute inset-0 cursor-zoom-out'
        data-slot='dialog-backdrop'
        tabIndex={-1}
      />
      <div className='relative'>{children}</div>
      {controls}
      <DialogPrimitive.Close
        aria-label={CLOSE_DIALOG_LABEL}
        className={cn(
          DIALOG_ICON_BUTTON_CLASS,
          'top-[clamp(12px,3vw,24px)] right-[clamp(12px,3vw,24px)]',
        )}
        data-slot='dialog-close'
      >
        <IconX aria-hidden className='size-5' stroke={ICON_STROKE_WIDTH} />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);
