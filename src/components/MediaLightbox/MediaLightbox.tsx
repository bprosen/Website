'use client';

import Image from 'next/image';
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
import { usePrefersReducedMotion, useSwipe } from '~/hooks';
import { cn } from '~/lib/ui';
import type { LightboxItem } from '~/types';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/ui';
import { fitToScreen, lightboxSizes, mediaPosition, wrapIndex } from '~/utils';
import { LightboxStepButton } from '../LightboxStepButton';

const ENLARGED_MEDIA_CLASS =
  'block h-auto rounded-2xl object-cover shadow-[0_24px_64px_rgb(0_0_0/0.45)]';

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
  const reducedMotion = usePrefersReducedMotion();
  const items = gallery ?? [item];
  const startIndex = Math.max(
    0,
    items.findIndex(({ src }) => src === item.src),
  );
  const [index, setIndex] = useState(startIndex);
  const shown = items[index] ?? item;
  const enlargedStyle = fitToScreen(shown.width, shown.height);
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
        {shown.video ? (
          <video
            autoPlay={!reducedMotion}
            className={ENLARGED_MEDIA_CLASS}
            controls
            disablePictureInPicture
            disableRemotePlayback
            key={shown.src}
            loop
            muted
            playsInline
            poster={shown.src}
            src={shown.video}
            style={enlargedStyle}
          />
        ) : (
          <Image
            alt=''
            className={ENLARGED_MEDIA_CLASS}
            height={shown.height}
            key={shown.src}
            loading='eager'
            sizes={lightboxSizes(shown.width, shown.height)}
            src={shown.src}
            style={enlargedStyle}
            width={shown.width}
          />
        )}
        {hasNeighbours && (
          <p aria-live='polite' className='sr-only'>
            {mediaPosition(index, items.length)}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
