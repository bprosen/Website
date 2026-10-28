import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { ENLARGE_MEDIA_LABEL, LIGHTBOX_MAX_VW } from '~/constants';
import { cn } from '~/lib/ui';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/ui';
import { fitToScreen } from '~/utils';

const ENLARGED_MEDIA =
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
}: MediaLightboxProps) => (
  <Dialog>
    <DialogTrigger
      aria-label={`${ENLARGE_MEDIA_LABEL}: ${alt}`}
      className={cn(
        'block cursor-zoom-in border-0 p-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      style={style}
      tabIndex={focusable ? undefined : -1}
    >
      {children}
    </DialogTrigger>
    <DialogContent>
      <DialogTitle className='sr-only'>{alt}</DialogTitle>
      {video ? (
        <video
          aria-label={alt}
          autoPlay
          className={ENLARGED_MEDIA}
          disablePictureInPicture
          disableRemotePlayback
          loop
          muted
          playsInline
          poster={src}
          src={video}
          style={fitToScreen(width, height)}
        />
      ) : (
        <Image
          alt={alt}
          className={ENLARGED_MEDIA}
          height={height}
          loading='eager'
          sizes={`min(${LIGHTBOX_MAX_VW}vw, ${width}px)`}
          src={src}
          style={fitToScreen(width, height)}
          width={width}
        />
      )}
    </DialogContent>
  </Dialog>
);
