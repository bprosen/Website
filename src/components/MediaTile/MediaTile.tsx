import { IconPhoto } from '@tabler/icons-react';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { PLACEHOLDER_ICON_STROKE } from '~/constants';
import { cn } from '~/lib/ui';
import type { MediaSlot } from '~/types';
import { LazyVideo } from '../LazyVideo';
import { MediaLightbox } from '../MediaLightbox';

type MediaTileProps = {
  className?: string;
  focusable?: boolean;
  iconClassName?: string;
  sizes: string;
  slot: MediaSlot;
};

export const MediaTile = ({
  className,
  focusable,
  iconClassName = 'size-7',
  sizes,
  slot,
}: MediaTileProps) => {
  const style: CSSProperties | undefined = slot.tint
    ? { backgroundColor: slot.tint }
    : undefined;
  const alt = slot.alt ?? slot.label;

  if (slot.src) {
    return (
      <MediaLightbox
        alt={alt}
        className={cn('relative m-0 overflow-hidden', className)}
        focusable={focusable}
        height={slot.height}
        src={slot.src}
        style={style}
        video={slot.video}
        width={slot.width}
      >
        {slot.video ? (
          <LazyVideo
            className='size-full object-cover'
            label={alt}
            poster={slot.src}
            sizes={sizes}
            src={slot.video}
          />
        ) : (
          <Image
            alt={alt}
            className={cn('object-cover', slot.focus === 'top' && 'object-top')}
            fill
            sizes={sizes}
            src={slot.src}
          />
        )}
      </MediaLightbox>
    );
  }

  return (
    <figure
      className={cn(
        'm-0 box-border flex flex-col items-center justify-center gap-2 p-3 text-center',
        className,
      )}
      style={style}
    >
      <IconPhoto
        aria-hidden
        className={iconClassName}
        stroke={PLACEHOLDER_ICON_STROKE}
      />
      <figcaption className='leading-[1.3]'>{slot.label}</figcaption>
    </figure>
  );
};
