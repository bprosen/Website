import { cn } from '~/lib/ui';
import type { MediaSlot } from '~/types';
import { MediaTile } from '../MediaTile';

const TILE_PLACEMENT = ['col-span-2 row-span-2', 'col-span-2', '', ''];
const TILE_SIZES = [
  '(min-width: 760px) 360px, 50vw',
  '(min-width: 760px) 360px, 50vw',
  '(min-width: 760px) 180px, 25vw',
  '(min-width: 760px) 180px, 25vw',
];

type CollageProps = {
  className?: string;
  label: string;
  slots: readonly MediaSlot[];
};

export const Collage = ({ className, label, slots }: CollageProps) => (
  <ul
    aria-label={label}
    className={cn(
      'm-0 grid max-w-[720px] list-none auto-rows-[clamp(84px,11vw,150px)] grid-cols-4 gap-3 p-0',
      className,
    )}
  >
    {slots.map((slot, index) => (
      <li className={TILE_PLACEMENT[index]} key={slot.label}>
        <MediaTile
          className='size-full rounded-[20px] bg-paper text-sm transition-transform duration-250 hover:scale-[1.03]'
          sizes={TILE_SIZES[index] ?? TILE_SIZES[3]}
          slot={slot}
        />
      </li>
    ))}
  </ul>
);
