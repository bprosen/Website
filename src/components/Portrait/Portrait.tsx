import Image from 'next/image';
import { PORTRAIT } from '~/constants';
import { cn } from '~/lib/ui';
import { MediaLightbox } from '../MediaLightbox';

type PortraitProps = {
  className?: string;
};

export const Portrait = ({ className }: PortraitProps) => (
  <MediaLightbox
    className={cn(
      'border-background relative size-22 overflow-hidden rounded-full border-4 shadow-[0_6px_16px_rgb(23_32_26/0.15)]',
      className,
    )}
    item={PORTRAIT}
  >
    <Image
      alt={PORTRAIT.alt}
      className='object-cover'
      fill
      loading='eager'
      sizes={PORTRAIT.sizes}
      src={PORTRAIT.src}
    />
  </MediaLightbox>
);
