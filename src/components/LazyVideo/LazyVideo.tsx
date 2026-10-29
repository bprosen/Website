'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '~/hooks';
import { cn } from '~/lib/ui';

type LazyVideoProps = {
  className?: string;
  label: string;
  poster: string;
  sizes: string;
  src: string;
};

const ignoreBlockedAutoplay = () => {};

export const LazyVideo = ({
  className,
  label,
  poster,
  sizes,
  src,
}: LazyVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || reducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(ignoreBlockedAutoplay);
      } else {
        video.pause();
      }
    });

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reducedMotion]);

  return (
    <div className={cn('relative', className)}>
      <Image alt='' className='object-cover' fill sizes={sizes} src={poster} />
      <video
        aria-label={label}
        className={cn(
          'absolute inset-0 size-full object-cover transition-opacity duration-300',
          playing || reducedMotion ? 'opacity-100' : 'opacity-0',
        )}
        loop
        muted
        onPlaying={() => setPlaying(true)}
        playsInline
        poster={reducedMotion ? poster : undefined}
        preload='none'
        ref={videoRef}
        src={src}
      />
    </div>
  );
};
