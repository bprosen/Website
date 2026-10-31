'use client';

import Image, { getImageProps } from 'next/image';
import { preload } from 'react-dom';
import { usePrefersReducedMotion } from '~/hooks';
import type { LightboxItem } from '~/types';
import { fitToScreen, lightboxSizes } from '~/utils';

const ENLARGED_MEDIA_CLASS =
  'bg-paper block h-auto rounded-2xl object-cover shadow-[0_24px_64px_rgb(0_0_0/0.45)]';

const preloadItem = (item: LightboxItem, sizes: string) => {
  if (item.video) {
    preload(item.src, { as: 'image' });
    return;
  }

  const { props } = getImageProps({
    alt: '',
    height: item.height,
    sizes,
    src: item.src,
    width: item.width,
  });
  preload(props.src, {
    as: 'image',
    imageSizes: props.sizes,
    imageSrcSet: props.srcSet,
  });
};

type LightboxMediaProps = {
  hasControls: boolean;
  item: LightboxItem;
  neighbours: readonly LightboxItem[];
};

export const LightboxMedia = ({
  hasControls,
  item,
  neighbours,
}: LightboxMediaProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const style = {
    ...fitToScreen(item.width, item.height),
    backgroundColor: item.tint,
  };

  for (const neighbour of neighbours) {
    preloadItem(
      neighbour,
      lightboxSizes(neighbour.width, neighbour.height, hasControls),
    );
  }

  if (item.video) {
    return (
      <video
        autoPlay={!reducedMotion}
        className={ENLARGED_MEDIA_CLASS}
        controls
        disablePictureInPicture
        disableRemotePlayback
        loop
        muted
        playsInline
        poster={item.src}
        src={item.video}
        style={style}
      />
    );
  }

  return (
    <Image
      alt=''
      className={ENLARGED_MEDIA_CLASS}
      height={item.height}
      loading='eager'
      sizes={lightboxSizes(item.width, item.height, hasControls)}
      src={item.src}
      style={style}
      width={item.width}
    />
  );
};
