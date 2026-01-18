'use client';

import { formatHex, parse } from 'culori';
import { useEffect, useRef } from 'react';
import type { VantaEffect } from '~/types';

type VantaNetProps = {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  backgroundColor?: number | string;
  color?: number | string;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
  showDots?: boolean;
  maxDistance?: number;
  spacing?: number;
};

export const VantaNet = ({
  children,
  className,
  containerClassName,
  backgroundColor = 'var(--primary)',
  color = '#FFFFFF',
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200.0,
  minWidth = 200.0,
  scale = 1.0,
  scaleMobile = 1.0,
  showDots = false,
  maxDistance = 25.0,
  spacing = 18.0,
}: VantaNetProps) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaInstance = useRef<VantaEffect | null>(null);

  useEffect(() => {
    if (!vantaRef.current || vantaInstance.current) {
      return;
    }

    const initVanta = () => {
      const VANTA = window?.VANTA;

      if (!vantaRef.current || !VANTA?.NET) {
        return;
      }

      try {
        const resolveColor = (colorValue: number | string): number | string => {
          if (typeof colorValue === 'number') {
            return colorValue;
          }

          if (colorValue.includes('var(')) {
            const computedColor = getComputedStyle(vantaRef.current)
              .getPropertyValue(colorValue.replace(/var\((--[\w-]+)\)/, '$1'))
              .trim();

            return computedColor ? formatHex(parse(computedColor)) : colorValue;
          }
          return formatHex(parse(colorValue));
        };
        const bgColor = resolveColor(backgroundColor);

        vantaInstance.current = VANTA.NET({
          el: vantaRef.current,
          gyroControls,
          maxDistance,
          minHeight,
          minWidth,
          mouseControls,
          scale,
          scaleMobile,
          showDots,
          spacing,
          touchControls,
          ...(bgColor && { backgroundColor: bgColor }),
          ...(color && { color }),
        });
      } catch (error) {
        console.error('Error initializing Vanta.NET:', error);
      }
    };

    if (typeof window !== 'undefined' && window.VANTA) {
      initVanta();
    } else {
      const checkInterval = setInterval(() => {
        if (window.VANTA && vantaRef.current) {
          clearInterval(checkInterval);
          initVanta();
        }
      }, 50);

      return () => clearInterval(checkInterval);
    }

    return () => {
      if (vantaInstance.current) {
        vantaInstance.current.destroy?.();
        vantaInstance.current = null;
      }
    };
  }, [
    mouseControls,
    touchControls,
    gyroControls,
    minHeight,
    minWidth,
    scale,
    scaleMobile,
    showDots,
    backgroundColor,
    color,
    spacing,
    maxDistance,
  ]);

  return (
    <div className={`relative h-full w-full ${containerClassName}`}>
      <div className='absolute inset-0 z-0 h-full w-full' ref={vantaRef} />
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  );
};
