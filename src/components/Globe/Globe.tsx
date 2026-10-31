'use client';

import { type ReactNode, useRef } from 'react';
import { GLOBE_LABEL } from '~/constants';
import { cn } from '~/lib/ui';
import type { LatLon, MarkerId } from '~/types';

import { useGlobeMotion } from './useGlobeMotion';

const MARKER_CLASS =
  'pointer-events-none absolute top-0 left-0 will-change-transform data-hidden:invisible';
const RING_CLASS =
  'absolute size-[6cqw] -translate-1/2 animate-ring rounded-full border-[0.75cqw] in-data-hidden:[animation-play-state:paused] in-data-paused:[animation-play-state:paused] in-data-motion-paused:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:opacity-50';
const DOT_CLASS =
  'absolute size-[5.25cqw] -translate-1/2 rounded-full border-[0.75cqw] border-paper';

type GlobeProps = {
  className?: string;
  onSelect: (marker: MarkerId | null) => void;
  selectedMarker: MarkerId | null;
  sharedHome?: boolean;
  tooltip: ReactNode;
  tooltipId: string;
  visitorCoords: LatLon | null;
  visitorDots: readonly LatLon[];
};

export const Globe = ({
  className,
  onSelect,
  selectedMarker,
  sharedHome = false,
  tooltip,
  tooltipId,
  visitorCoords,
  visitorDots,
}: GlobeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const homeMarkerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const visitorMarkerRef = useRef<HTMLSpanElement>(null);

  useGlobeMotion({
    canvasRef,
    containerRef,
    homeMarkerRef,
    onSelect,
    selectedMarker,
    tooltipRef,
    visitorCoords,
    visitorDots,
    visitorMarkerRef,
  });

  return (
    <div
      aria-describedby={selectedMarker !== null ? tooltipId : undefined}
      aria-label={GLOBE_LABEL}
      className={cn(
        '@container relative aspect-square w-full max-w-[min(320px,34svh)] cursor-grab touch-pan-y touch-pinch-zoom rounded-full select-none [-webkit-tap-highlight-color:transparent] active:cursor-grabbing',
        className,
      )}
      ref={containerRef}
      role='application'
      // biome-ignore lint/a11y/noNoninteractiveTabindex: `application` is ARIA's role for a custom keyboard widget (arrow keys spin the globe), so it must be focusable; Biome counts it as non-interactive.
      tabIndex={0}
    >
      <div aria-hidden className='absolute inset-0'>
        <div className='border-ink bg-accent absolute inset-[2.5%] rounded-full border-[1cqw]' />
        <canvas className='absolute inset-0 size-full' ref={canvasRef} />
      </div>
      <span
        aria-hidden
        className={MARKER_CLASS}
        data-hidden
        ref={homeMarkerRef}
      >
        <span className='motion-safe:animate-intro-pin absolute top-0 left-0 motion-safe:[animation-delay:1100ms]'>
          <span className={cn(RING_CLASS, 'border-ink')} />
          <span
            className={cn(
              RING_CLASS,
              '[animation-delay:1200ms]',
              sharedHome ? 'border-coral-deep' : 'border-ink',
            )}
            data-shared={sharedHome ? true : undefined}
          />
          <span className={cn(DOT_CLASS, 'bg-ink')} />
        </span>
      </span>
      <span
        aria-hidden
        className={MARKER_CLASS}
        data-hidden
        ref={visitorMarkerRef}
      >
        <span className={cn(RING_CLASS, 'border-coral-deep')} />
        <span
          className={cn(
            RING_CLASS,
            'border-coral-deep [animation-delay:1200ms]',
          )}
        />
        <span className={cn(DOT_CLASS, 'border-ink bg-coral')} />
      </span>
      <div
        className='pointer-events-none absolute top-0 left-0 z-3 data-hidden:invisible'
        data-hidden
        ref={tooltipRef}
      >
        {selectedMarker !== null && (
          <div
            className='bg-inverse text-inverse-foreground translate-y-[calc(-100%-16px)] rounded-xl px-3.5 py-2 text-sm leading-[1.35] whitespace-nowrap shadow-[0_8px_20px_rgb(23_32_26/0.25)]'
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
