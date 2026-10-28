'use client';

import { IconCheck, IconCopy, IconMail } from '@tabler/icons-react';
import {
  COPIED_EMAIL_LABEL,
  COPY_EMAIL_LABEL,
  EMAIL,
  ICON_STROKE,
  MAILTO,
} from '~/constants';
import { useCopyToClipboard } from '~/hooks';

const FOCUS_RING =
  'outline-none focus-visible:ring-[3px] focus-visible:ring-inverse-foreground/60';

export const EmailPill = () => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className='inline-flex h-13 max-w-full max-sm:h-11 items-center rounded-full bg-accent pr-3 pl-[22px] max-sm:pr-1.5 max-sm:pl-4 max-sm:text-[15px] font-semibold text-accent-foreground transition-[translate] duration-200 ease-out hover:-translate-y-0.5'>
      <a
        className={`inline-flex min-w-0 items-center gap-2.5 rounded-full max-[379px]:gap-2 text-inherit no-underline ${FOCUS_RING}`}
        href={MAILTO}
      >
        <IconMail
          aria-hidden
          className='size-[22px] shrink-0'
          stroke={ICON_STROKE}
        />
        <span className='truncate max-sm:sr-only'>{EMAIL}</span>
      </a>
      <span
        aria-hidden
        className='mr-1 ml-2.5 h-6 w-px shrink-0 bg-accent-foreground/20'
      />
      <button
        aria-label={COPY_EMAIL_LABEL}
        className={`inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-inherit transition-colors duration-200 hover:bg-accent-foreground/10 ${FOCUS_RING}`}
        onClick={() => copy(EMAIL)}
        title={COPY_EMAIL_LABEL}
        type='button'
      >
        {copied ? (
          <IconCheck aria-hidden className='size-5' stroke={ICON_STROKE} />
        ) : (
          <IconCopy aria-hidden className='size-5' stroke={ICON_STROKE} />
        )}
        <span aria-live='polite' className='sr-only'>
          {copied ? COPIED_EMAIL_LABEL : ''}
        </span>
      </button>
    </div>
  );
};
