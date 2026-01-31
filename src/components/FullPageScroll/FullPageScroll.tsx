'use client';

import { motion, useInView } from 'framer-motion';
import { Children, type ReactNode, type RefObject, useRef } from 'react';
import { cn } from '~/lib/ui';

type BlurPageProps = {
  children: ReactNode;
  scrollRef: RefObject<HTMLDivElement | null>;
  blur?: boolean;
};

const BlurPage = ({ children, scrollRef, blur }: BlurPageProps) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(pageRef, {
    amount: 0.5,
    root: scrollRef,
  });

  return (
    <motion.div
      animate={{
        filter: blur && !isInView ? 'blur(10px)' : 'blur(0px)',
      }}
      className='min-h-screen w-full snap-start snap-always'
      initial={false}
      ref={pageRef}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'tween',
      }}
    >
      {children}
    </motion.div>
  );
};

type FullPageBlurScrollProps = {
  children: ReactNode;
  className?: string;
  blur?: boolean;
};

export const FullPageBlurScroll = ({
  children,
  className,
  blur,
}: FullPageBlurScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pages = Children.toArray(children);

  return (
    <div
      className={cn(
        'h-screen min-h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory',
        className,
      )}
      ref={scrollRef}
    >
      {pages.map((page, index) => (
        <BlurPage
          blur={blur}
          key={`scroll-page-${index + 1}`}
          scrollRef={scrollRef}
        >
          {page}
        </BlurPage>
      ))}
    </div>
  );
};
