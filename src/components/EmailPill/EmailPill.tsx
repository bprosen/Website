'use client';

import { IconCheck, IconCopy, IconMail } from '@tabler/icons-react';
import {
  COPIED_EMAIL_LABEL,
  COPY_EMAIL_LABEL,
  EMAIL,
  EMAIL_HREF,
  ICON_STROKE_WIDTH,
} from '~/constants';
import { useCopyToClipboard } from '~/hooks';
import { Button } from '~/ui';

const ICON_SHOWN = 'ease-out-back scale-100 opacity-100 blur-none duration-300';
const ICON_HIDDEN = 'scale-50 opacity-0 blur-[2px] duration-150 ease-out';

export const EmailPill = () => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className='bg-accent text-accent-foreground inline-flex h-13 max-w-full items-center rounded-full pr-3 pl-[22px] font-semibold transition-[translate] duration-200 ease-out [--ring:var(--accent-foreground)] hover:-translate-y-0.5 max-sm:h-11 max-sm:pr-1.5 max-sm:pl-4 max-sm:text-[15px]'>
      <a
        className='max-compact:gap-2 inline-flex min-w-0 items-center gap-2.5 rounded-full'
        href={EMAIL_HREF}
      >
        <IconMail
          aria-hidden
          className='size-[22px] shrink-0'
          stroke={ICON_STROKE_WIDTH}
        />
        <span className='truncate max-sm:sr-only'>{EMAIL}</span>
      </a>
      <span
        aria-hidden
        className='bg-accent-foreground/20 mr-1 ml-2.5 h-6 w-px shrink-0'
      />
      <Button
        aria-label={COPY_EMAIL_LABEL}
        className='hover:bg-accent-foreground/10 size-10 cursor-pointer hover:translate-y-0'
        onClick={() => copy(EMAIL)}
        size='icon'
        title={COPY_EMAIL_LABEL}
        type='button'
        variant='ghost'
      >
        <span className='grid *:col-start-1 *:row-start-1 *:size-5 *:transition-[opacity,scale,filter] *:motion-reduce:transition-none'>
          <IconCopy
            aria-hidden
            className={copied ? ICON_HIDDEN : ICON_SHOWN}
            stroke={ICON_STROKE_WIDTH}
          />
          <IconCheck
            aria-hidden
            className={copied ? ICON_SHOWN : ICON_HIDDEN}
            stroke={ICON_STROKE_WIDTH}
          />
        </span>
        <span aria-live='polite' className='sr-only'>
          {copied ? COPIED_EMAIL_LABEL : ''}
        </span>
      </Button>
    </div>
  );
};
