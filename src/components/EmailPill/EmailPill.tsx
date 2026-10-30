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

export const EmailPill = () => {
  const { copied, copy } = useCopyToClipboard();
  const CopyIcon = copied ? IconCheck : IconCopy;

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
        <CopyIcon aria-hidden className='size-5' stroke={ICON_STROKE_WIDTH} />
        <span aria-live='polite' className='sr-only'>
          {copied ? COPIED_EMAIL_LABEL : ''}
        </span>
      </Button>
    </div>
  );
};
