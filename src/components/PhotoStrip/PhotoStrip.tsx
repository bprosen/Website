import { PHOTOS } from '~/constants';
import { cn } from '~/lib/ui';
import type { MediaSlot } from '~/types';
import { MediaTile } from '../MediaTile';

const TILE_CLASS = 'relative size-full gap-1.5 rounded-2xl text-[13px]';

type PhotoStripProps = {
  className?: string;
  photos?: readonly MediaSlot[];
};

export const PhotoStrip = ({ className, photos = PHOTOS }: PhotoStripProps) => {
  const tiles = (copy: boolean) =>
    photos.map((slot) => (
      <li
        aria-hidden={copy || undefined}
        className={cn(
          'aspect-[4/5] w-[136px] flex-[0_0_auto]',
          copy && 'motion-reduce:hidden',
        )}
        key={`${copy ? 'copy' : 'photo'}-${slot.label}`}
      >
        <MediaTile
          className={TILE_CLASS}
          iconClassName='size-6'
          sizes='136px'
          slot={slot}
        />
      </li>
    ));

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-2xl [contain-intrinsic-size:auto_170px] [content-visibility:auto] motion-reduce:overflow-x-auto',
        className,
      )}
    >
      <ul
        aria-label='Photos'
        className='m-0 flex w-max animate-drift list-none gap-3 p-0 group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused] motion-reduce:animate-none'
      >
        {tiles(false)}
        {tiles(true)}
      </ul>
    </div>
  );
};
