import { cn } from '~/lib/ui';
import type { MediaSlot } from '~/types';
import { toLightboxItems } from '~/utils';
import { MediaTile } from '../MediaTile';

const WIDE_TILE = {
  layoutClassName: 'col-span-2 aspect-[2/1]',
  sizes: '(min-width: 760px) 720px, calc(100vw - 64px)',
};
const HALF_TILE = {
  layoutClassName: 'aspect-video',
  sizes: '(min-width: 760px) 354px, calc(50vw - 38px)',
};
const TILE_LAYOUTS = [WIDE_TILE, HALF_TILE, HALF_TILE];

type CollageProps = {
  className?: string;
  label: string;
  slots: readonly MediaSlot[];
};

export const Collage = ({ className, label, slots }: CollageProps) => {
  const gallery = toLightboxItems(slots);

  return (
    <ul
      aria-label={label}
      className={cn('grid max-w-[720px] grid-cols-2 gap-3', className)}
    >
      {slots.map((slot, index) => {
        const { layoutClassName, sizes } = TILE_LAYOUTS[index] ?? HALF_TILE;

        return (
          <li className={layoutClassName} key={slot.label}>
            <MediaTile
              className='bg-paper size-full rounded-[20px] text-sm transition-transform duration-250 hover:scale-[1.03]'
              gallery={gallery}
              sizes={sizes}
              slot={slot}
            />
          </li>
        );
      })}
    </ul>
  );
};
