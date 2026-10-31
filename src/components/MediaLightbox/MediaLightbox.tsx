'use client';

import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useState,
} from 'react';
import {
  ARROW_KEY_STEPS,
  ENLARGE_MEDIA_LABEL,
  LIGHTBOX_GALLERY_RESERVE_CLASS,
} from '~/constants';
import { useSwipe } from '~/hooks';
import { cn } from '~/lib/ui';
import type { LightboxItem } from '~/types';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/ui';
import { mediaPosition, neighbourItems, wrapIndex } from '~/utils';
import { LightboxMedia } from '../LightboxMedia';
import { LightboxStepButton } from '../LightboxStepButton';

type MediaLightboxProps = {
  children: ReactNode;
  className?: string;
  focusable?: boolean;
  gallery?: readonly LightboxItem[];
  item: LightboxItem;
  style?: CSSProperties;
};

export const MediaLightbox = ({
  children,
  className,
  focusable = true,
  gallery,
  item,
  style,
}: MediaLightboxProps) => {
  const items = gallery ?? [item];
  const startIndex = Math.max(
    0,
    items.findIndex(({ src }) => src === item.src),
  );
  const [index, setIndex] = useState(startIndex);
  const shown = items[index] ?? item;
  const hasNeighbours = items.length > 1;

  const step = (delta: number) =>
    setIndex((current) => wrapIndex(current + delta, items.length));
  const swipeHandlers = useSwipe(step);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIndex(startIndex);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const delta = ARROW_KEY_STEPS[event.key];

    if (delta && !(event.target instanceof HTMLMediaElement)) {
      event.preventDefault();
      step(delta);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger
        aria-label={`${ENLARGE_MEDIA_LABEL}: ${item.alt}`}
        className={cn('block cursor-zoom-in', className)}
        style={style}
        tabIndex={focusable ? undefined : -1}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className={cn(hasNeighbours && LIGHTBOX_GALLERY_RESERVE_CLASS)}
        controls={
          hasNeighbours && (
            <>
              <LightboxStepButton
                direction='previous'
                onClick={() => step(-1)}
              />
              <LightboxStepButton direction='next' onClick={() => step(1)} />
            </>
          )
        }
        onKeyDown={handleKeyDown}
        {...swipeHandlers}
      >
        <DialogTitle className='sr-only'>{shown.alt}</DialogTitle>
        <LightboxMedia
          hasControls={hasNeighbours}
          item={shown}
          key={shown.src}
          neighbours={neighbourItems(items, index)}
        />
        {hasNeighbours && (
          <p aria-live='polite' className='sr-only'>
            {mediaPosition(index, items.length)}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
