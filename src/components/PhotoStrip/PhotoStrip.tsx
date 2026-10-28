'use client';

import { useRef } from 'react';
import { PHOTO_STRIP_SPEED_PX_PER_S, PHOTOS } from '~/constants';
import { useAutoScroll } from '~/hooks';
import { cn } from '~/lib/ui';
import type { MediaSlot } from '~/types';
import { MediaTile } from '../MediaTile';

const TILE_CLASS =
  'relative size-full gap-1.5 rounded-2xl text-[13px] transition-transform duration-250 hover:scale-[1.03]';

type PhotoStripProps = {
  className?: string;
  photos?: readonly MediaSlot[];
};

export const PhotoStrip = ({ className, photos = PHOTOS }: PhotoStripProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  useAutoScroll(scrollerRef, PHOTO_STRIP_SPEED_PX_PER_S);

  const tiles = (copy: boolean) =>
    photos.map((slot) => (
      <li
        aria-hidden={copy || undefined}
        className={cn(
          'aspect-[4/5] w-44 flex-[0_0_auto]',
          copy && 'motion-reduce:hidden',
        )}
        key={`${copy ? 'copy' : 'photo'}-${slot.label}`}
      >
        <MediaTile
          className={TILE_CLASS}
          focusable={!copy}
          iconClassName='size-6'
          sizes='176px'
          slot={slot}
        />
      </li>
    ));

  return (
    <div
      className={cn(
        '-my-2 overflow-x-auto overscroll-x-contain rounded-2xl py-2 [contain-intrinsic-size:auto_236px] [content-visibility:auto] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      ref={scrollerRef}
    >
      <ul aria-label='Photos' className='m-0 flex w-max list-none gap-3 p-0'>
        {tiles(false)}
        {tiles(true)}
      </ul>
    </div>
  );
};
