'use client';

import { type ReactNode, useRef } from 'react';
import { GLOBE_LABEL } from '~/constants';
import { cn } from '~/lib/ui';
import type { LatLon } from '~/types';
import type { MarkerId } from '~/utils';
import { useGlobeMotion } from './useGlobeMotion';

const MARKER_CLASS =
  'pointer-events-none absolute top-0 left-0 will-change-transform data-hidden:invisible';
const RING_CLASS =
  'absolute size-[6cqw] -translate-1/2 animate-ring rounded-full border-[0.75cqw] in-data-hidden:[animation-play-state:paused] in-data-paused:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:opacity-50';
const DOT_CLASS =
  'absolute size-[5.25cqw] -translate-1/2 rounded-full border-[0.75cqw] border-paper';

type GlobeProps = {
  dots: readonly LatLon[];
  onSelect: (marker: MarkerId | null) => void;
  sharedHome?: boolean;
  tip: MarkerId | null;
  tooltip: ReactNode;
  className?: string;
  tooltipId: string;
  visitorCoords: LatLon | null;
};

export const Globe = ({
  className,
  dots,
  onSelect,
  sharedHome = false,
  tip,
  tooltip,
  tooltipId,
  visitorCoords,
}: GlobeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const meRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const youRef = useRef<HTMLSpanElement>(null);

  useGlobeMotion({
    canvasRef,
    containerRef,
    dots,
    meRef,
    onSelect,
    tip,
    tooltipRef,
    visitorCoords,
    youRef,
  });

  return (
    <div
      aria-describedby={tip ? tooltipId : undefined}
      aria-label={GLOBE_LABEL}
      className={cn(
        '@container relative aspect-square w-full max-w-[min(320px,34svh)] cursor-grab touch-pan-y touch-pinch-zoom select-none rounded-full outline-none [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid focus-visible:outline-ink active:cursor-grabbing',
        className,
      )}
      ref={containerRef}
      role='application'
      // biome-ignore lint/a11y/noNoninteractiveTabindex: `application` is ARIA's role for a custom keyboard widget (arrow keys spin the globe), so it must be focusable; Biome counts it as non-interactive.
      tabIndex={0}
    >
      <div aria-hidden='true' className='absolute inset-0'>
        <div className='absolute inset-[2.5%] rounded-full border-[1cqw] border-ink bg-accent' />
        <canvas className='absolute inset-0 size-full' ref={canvasRef} />
      </div>
      <span aria-hidden='true' className={MARKER_CLASS} data-hidden ref={meRef}>
        <span className='absolute top-0 left-0 motion-safe:animate-intro-pin motion-safe:[animation-delay:1100ms]'>
          <span className={`${RING_CLASS} border-ink`} />
          <span
            className={cn(
              RING_CLASS,
              '[animation-delay:1.2s]',
              sharedHome ? 'border-coral-deep' : 'border-ink',
            )}
            data-shared={sharedHome || undefined}
          />
          <span className={`${DOT_CLASS} bg-ink`} />
        </span>
      </span>
      <span
        aria-hidden='true'
        className={MARKER_CLASS}
        data-hidden
        ref={youRef}
      >
        <span className={`${RING_CLASS} border-coral-deep`} />
        <span
          className={`${RING_CLASS} border-coral-deep [animation-delay:1.2s]`}
        />
        <span className={`${DOT_CLASS} bg-coral`} />
      </span>
      <div
        className='pointer-events-none absolute top-0 left-0 z-3 data-hidden:invisible'
        data-hidden
        ref={tooltipRef}
      >
        {tip && (
          <div
            className='translate-y-[calc(-100%-16px)] rounded-xl bg-inverse px-3.5 py-2 text-sm leading-[1.35] whitespace-nowrap text-inverse-foreground shadow-[0_8px_20px_rgb(23_32_26/0.25)]'
            id={tooltipId}
            role='tooltip'
          >
            {tooltip}
          </div>
        )}
      </div>
    </div>
  );
};
