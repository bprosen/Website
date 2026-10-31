'use client';

import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { ENLARGE_MEDIA_LABEL } from '~/constants';
import { usePrefersReducedMotion } from '~/hooks';
import { cn } from '~/lib/ui';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/ui';
import { fitToScreen, lightboxSizes } from '~/utils';

const ENLARGED_MEDIA_CLASS =
  'block h-auto rounded-2xl object-cover shadow-[0_24px_64px_rgb(0_0_0/0.45)]';

type MediaLightboxProps = {
  alt: string;
  children: ReactNode;
  className?: string;
  focusable?: boolean;
  height: number;
  src: string;
  style?: CSSProperties;
  video?: string;
  width: number;
};

export const MediaLightbox = ({
  alt,
  children,
  className,
  focusable = true,
  height,
  src,
  style,
  video,
  width,
}: MediaLightboxProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const enlargedStyle = fitToScreen(width, height);

  return (
    <Dialog>
      <DialogTrigger
        aria-label={`${ENLARGE_MEDIA_LABEL}: ${alt}`}
        className={cn('block cursor-zoom-in', className)}
        style={style}
        tabIndex={focusable ? undefined : -1}
      >
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className='sr-only'>{alt}</DialogTitle>
        {video ? (
          <video
            autoPlay={!reducedMotion}
            className={ENLARGED_MEDIA_CLASS}
            controls
            disablePictureInPicture
            disableRemotePlayback
            loop
            muted
            playsInline
            poster={src}
            src={video}
            style={enlargedStyle}
          />
        ) : (
          <Image
            alt=''
            className={ENLARGED_MEDIA_CLASS}
            height={height}
            loading='eager'
            sizes={lightboxSizes(width, height)}
            src={src}
            style={enlargedStyle}
            width={width}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
