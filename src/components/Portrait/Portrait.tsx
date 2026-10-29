import Image from 'next/image';
import { PORTRAIT } from '~/constants';
import { cn } from '~/lib/ui';
import { MediaLightbox } from '../MediaLightbox';

type PortraitProps = {
  className?: string;
  size?: number;
};

export const Portrait = ({
  className,
  size = PORTRAIT.size,
}: PortraitProps) => (
  <MediaLightbox
    alt={PORTRAIT.alt}
    className={cn(
      'relative size-22 overflow-hidden rounded-full border-4 border-background shadow-[0_6px_16px_rgb(23_32_26/0.15)]',
      className,
    )}
    height={PORTRAIT.height}
    src={PORTRAIT.src}
    width={PORTRAIT.width}
  >
    <Image
      alt={PORTRAIT.alt}
      className='object-cover'
      fill
      sizes={`${size}px`}
      src={PORTRAIT.src}
    />
  </MediaLightbox>
);
