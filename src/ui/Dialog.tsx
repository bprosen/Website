import { IconX } from '@tabler/icons-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { CLOSE_DIALOG_LABEL, ICON_STROKE } from '~/constants';
import { cn } from '~/lib/ui';

export const Dialog = (props: ComponentProps<typeof DialogPrimitive.Root>) => (
  <DialogPrimitive.Root data-slot='dialog' {...props} />
);

export const DialogTrigger = (
  props: ComponentProps<typeof DialogPrimitive.Trigger>,
) => <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />;

export const DialogTitle = (
  props: ComponentProps<typeof DialogPrimitive.Title>,
) => <DialogPrimitive.Title data-slot='dialog-title' {...props} />;

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content>;

export const DialogContent = ({
  children,
  className,
  ...props
}: DialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      className='fixed inset-0 z-100 bg-ink/55 backdrop-blur-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none'
      data-slot='dialog-overlay'
    />
    <DialogPrimitive.Content
      aria-describedby={undefined}
      className={cn(
        'fixed inset-0 z-100 flex items-center justify-center p-[clamp(16px,4vw,48px)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none',
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
      <DialogPrimitive.Close
        aria-label={CLOSE_DIALOG_LABEL}
        className='absolute top-[clamp(12px,3vw,24px)] right-[clamp(12px,3vw,24px)] inline-flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-paper/85 text-ink shadow-[0_6px_16px_rgb(23_32_26/0.25)] outline-none transition-[background-color,scale] duration-200 hover:scale-105 hover:bg-paper focus-visible:ring-[3px] focus-visible:ring-ring/50'
        data-slot='dialog-close'
      >
        <IconX aria-hidden className='size-5' stroke={ICON_STROKE} />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);
