import { cn } from '~/lib/ui';
import type { MediaSlot } from '~/types';
import { MediaTile } from '../MediaTile';

const TILE_PLACEMENT = [
  'col-span-2 aspect-[2/1]',
  'aspect-video',
  'aspect-video',
];
const TILE_SIZES = [
  '(min-width: 760px) 720px, calc(100vw - 64px)',
  '(min-width: 760px) 354px, calc(50vw - 38px)',
  '(min-width: 760px) 354px, calc(50vw - 38px)',
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
      'm-0 grid max-w-[720px] list-none grid-cols-2 gap-3 p-0',
      className,
    )}
  >
    {slots.map((slot, index) => (
      <li className={TILE_PLACEMENT[index]} key={slot.label}>
        <MediaTile
          className='size-full rounded-[20px] bg-paper text-sm transition-transform duration-250 hover:scale-[1.03]'
          sizes={TILE_SIZES[index] ?? TILE_SIZES[1]}
          slot={slot}
        />
      </li>
    ))}
  </ul>
);
