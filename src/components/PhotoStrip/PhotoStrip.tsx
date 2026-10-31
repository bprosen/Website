'use client';

import type { ImageProps } from 'next/image';
import { useRef } from 'react';
import {
  ABOUT_PHOTOS,
  PHOTO_STRIP_LABEL,
  PHOTO_STRIP_SPEED_PX_PER_SECOND,
} from '~/constants';
import { useAutoScroll } from '~/hooks';
import { cn } from '~/lib/ui';
import type { MediaSlot } from '~/types';
import { toLightboxItems } from '~/utils';
import { MediaTile } from '../MediaTile';

const TILE_CLASS =
  'relative size-full gap-1.5 rounded-2xl text-[13px] transition-transform duration-250 hover:scale-[1.03]';

type PhotoStripProps = {
  className?: string;
  loading?: ImageProps['loading'];
  photos?: readonly MediaSlot[];
};

export const PhotoStrip = ({
  className,
  loading,
  photos = ABOUT_PHOTOS,
}: PhotoStripProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  useAutoScroll(scrollerRef, PHOTO_STRIP_SPEED_PX_PER_SECOND);
  const gallery = toLightboxItems(photos);

  const renderTiles = ({ decorative }: { decorative: boolean }) =>
    photos.map((slot) => (
      <li
        aria-hidden={decorative ? true : undefined}
        className={cn(
          'aspect-[4/5] w-44 flex-[0_0_auto]',
          decorative && 'motion-reduce:hidden',
        )}
        key={`${decorative ? 'copy' : 'photo'}-${slot.label}`}
      >
        <MediaTile
          className={TILE_CLASS}
          focusable={!decorative}
          gallery={gallery}
          iconClassName='size-6'
          loading={loading}
          sizes='176px'
          slot={slot}
        />
      </li>
    ));

  return (
    <div
      className={cn(
        '-my-2 [scrollbar-width:none] overflow-x-auto overscroll-x-contain rounded-2xl [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)] py-2 [contain-intrinsic-size:auto_236px] [content-visibility:auto] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      ref={scrollerRef}
    >
      <ul aria-label={PHOTO_STRIP_LABEL} className='flex w-max gap-3'>
        {renderTiles({ decorative: false })}
        {renderTiles({ decorative: true })}
      </ul>
    </div>
  );
};
