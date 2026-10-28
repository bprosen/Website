import { IconPhoto } from '@tabler/icons-react';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { PLACEHOLDER_ICON_STROKE } from '~/constants';
import { cn } from '~/lib/ui';
import type { MediaSlot } from '~/types';

type MediaTileProps = {
  className?: string;
  iconClassName?: string;
  sizes: string;
  slot: MediaSlot;
};

export const MediaTile = ({
  className,
  iconClassName = 'size-7',
  sizes,
  slot,
}: MediaTileProps) => {
  const style: CSSProperties | undefined = slot.tint
    ? { backgroundColor: slot.tint }
    : undefined;

  if (slot.src) {
    return (
      <figure
        className={cn('relative m-0 overflow-hidden', className)}
        style={style}
      >
        <Image
          alt={slot.alt ?? slot.label}
          className='object-cover'
          fill
          sizes={sizes}
          src={slot.src}
        />
      </figure>
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
