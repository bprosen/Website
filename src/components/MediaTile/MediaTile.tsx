import { IconPhoto } from '@tabler/icons-react';
import Image, { type ImageProps } from 'next/image';
import type { CSSProperties } from 'react';
import { PLACEHOLDER_ICON_STROKE_WIDTH } from '~/constants';
import { cn } from '~/lib/ui';
import type { MediaSlot } from '~/types';
import { LazyVideo } from '../LazyVideo';
import { MediaLightbox } from '../MediaLightbox';

type MediaTileProps = {
  className?: string;
  focusable?: boolean;
  iconClassName?: string;
  loading?: ImageProps['loading'];
  sizes: string;
  slot: MediaSlot;
};

export const MediaTile = ({
  className,
  focusable,
  iconClassName = 'size-7',
  loading,
  sizes,
  slot,
}: MediaTileProps) => {
  const tintStyle: CSSProperties | undefined = slot.tint
    ? { backgroundColor: slot.tint }
    : undefined;
  const alt = slot.alt ?? slot.label;

  if (slot.src) {
    return (
      <MediaLightbox
        alt={alt}
        className={cn('relative overflow-hidden', className)}
        focusable={focusable}
        height={slot.height}
        src={slot.src}
        style={tintStyle}
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
            loading={loading}
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
        'flex flex-col items-center justify-center gap-2 p-3 text-center',
        className,
      )}
      style={tintStyle}
    >
      <IconPhoto
        aria-hidden
        className={iconClassName}
        stroke={PLACEHOLDER_ICON_STROKE_WIDTH}
      />
      <figcaption className='leading-[1.3]'>{slot.label}</figcaption>
    </figure>
  );
};
