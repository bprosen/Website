import Image from 'next/image';
import { PORTRAIT } from '~/constants';
import { cn } from '~/lib/ui';

type PortraitProps = {
  className?: string;
};

export const Portrait = ({ className }: PortraitProps) => (
  <Image
    alt={PORTRAIT.alt}
    className={cn(
      'size-22 rounded-full border-4 border-background object-cover shadow-[0_6px_16px_rgb(23_32_26/0.15)]',
      className,
    )}
    height={PORTRAIT.size}
    sizes={`${PORTRAIT.size}px`}
    src={PORTRAIT.src}
    width={PORTRAIT.size}
  />
);
