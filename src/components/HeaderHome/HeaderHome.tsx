'use client';

import Image from 'next/image';
import { FULL_NAME, HERO_NAME_ID, PORTRAIT, SITE_HEADER_ID } from '~/constants';
import { useScrolledPast } from '~/hooks';
import { cn } from '~/lib/ui';
import { SectionLink } from '../SectionLink';

type HeaderHomeProps = {
  className?: string;
};

export const HeaderHome = ({ className }: HeaderHomeProps) => {
  const visible = useScrolledPast({
    coverId: SITE_HEADER_ID,
    targetId: HERO_NAME_ID,
  });

  return (
    <SectionLink
      aria-label={FULL_NAME}
      className={cn(
        'inline-flex min-h-11 shrink-0 items-center rounded-full transition-[opacity,scale,translate,visibility] duration-300 ease-out data-[visible=false]:invisible data-[visible=false]:opacity-0 motion-reduce:transition-opacity max-sm:data-[visible=false]:scale-50 sm:data-[visible=false]:-translate-y-[18px]',
        className,
      )}
      data-visible={visible}
      section={null}
    >
      <span className='ring-background relative size-9 overflow-hidden rounded-full ring-2 sm:hidden'>
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
        {FULL_NAME}
      </span>
    </SectionLink>
  );
};
