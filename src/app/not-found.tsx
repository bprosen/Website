import type { Metadata } from 'next';
import Link from 'next/link';
import {
  NAME,
  NOT_FOUND_ACTION,
  NOT_FOUND_COPY,
  NOT_FOUND_TITLE,
} from '~/constants';
import { Button } from '~/ui';

export const metadata: Metadata = {
  title: `Page not found · ${NAME}`,
};

const NotFound = () => (
  <main className='mx-auto box-border flex min-h-svh max-w-[1240px] flex-col items-start justify-center gap-6 px-[clamp(20px,5vw,56px)]'>
    <p className='m-0 font-serif text-xl font-semibold'>404</p>
    <h1 className='m-0 font-serif text-[clamp(44px,7vw,96px)] leading-[0.98] font-semibold tracking-[-0.035em]'>
      {NOT_FOUND_TITLE}
    </h1>
    <p className='m-0 max-w-[520px] text-[clamp(18px,2vw,22px)] text-muted-foreground'>
      {NOT_FOUND_COPY}
    </p>
    <Button asChild className='mt-2'>
      <Link href='/'>{NOT_FOUND_ACTION}</Link>
    </Button>
  </main>
);

export default NotFound;
