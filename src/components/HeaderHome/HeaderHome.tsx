'use client';

import Image from 'next/image';
import { HERO_NAME_ID, NAME, PORTRAIT, SITE_HEADER_ID } from '~/constants';
import { useScrolledPast } from '~/hooks';
import { cn } from '~/lib/ui';
import { SectionLink } from '../SectionLink';

type HeaderHomeProps = {
  className?: string;
};

export const HeaderHome = ({ className }: HeaderHomeProps) => {
  const visible = useScrolledPast(HERO_NAME_ID, SITE_HEADER_ID);

  return (
    <SectionLink
      aria-label={NAME}
      className={cn(
        'inline-flex min-h-11 shrink-0 items-center rounded-full no-underline outline-none transition-[opacity,scale,translate,visibility] duration-300 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[visible=false]:invisible data-[visible=false]:opacity-0 max-sm:data-[visible=false]:scale-50 sm:data-[visible=false]:-translate-y-[18px] motion-reduce:transition-opacity',
        className,
      )}
      data-visible={visible}
      section={null}
    >
      <span className='relative size-9 overflow-hidden rounded-full ring-2 ring-background sm:hidden'>
        <Image
          alt=''
          className='object-cover'
          fill
          loading='eager'
          sizes={PORTRAIT.sizes}
          src={PORTRAIT.src}
        />
      </span>
      <span className='font-serif text-[22px] font-semibold max-sm:hidden'>
        {NAME}
      </span>
    </SectionLink>
  );
};
