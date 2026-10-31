import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FULL_NAME,
  NOT_FOUND_BODY,
  NOT_FOUND_HEADING,
  NOT_FOUND_LINK_LABEL,
  NOT_FOUND_PAGE_TITLE,
  NOT_FOUND_STATUS,
} from '~/constants';
import { Button } from '~/ui';
import { pageTitle } from '~/utils';

export const metadata: Metadata = {
  title: pageTitle(NOT_FOUND_PAGE_TITLE),
};

const NotFound = () => (
  <main className='page-container flex min-h-svh flex-col items-start justify-center gap-6'>
    <p className='text-muted-foreground text-base'>{FULL_NAME}</p>
    <p className='font-serif text-xl font-semibold'>{NOT_FOUND_STATUS}</p>
    <h1 className='font-serif text-[clamp(44px,7vw,96px)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance'>
      {NOT_FOUND_HEADING}
    </h1>
    <p className='text-muted-foreground max-w-[520px] text-[clamp(18px,2vw,22px)]'>
      {NOT_FOUND_BODY}
    </p>
    <Button asChild className='mt-2'>
      <Link href='/'>{NOT_FOUND_LINK_LABEL}</Link>
    </Button>
  </main>
);

export default NotFound;
