'use client';

import { useId, useState } from 'react';
import { GLOBE_CARD_QUERY, HOME_CITY, HOME_MARKER_LABEL } from '~/constants';
import { useMediaQuery, useVisitor, useVisitorDots } from '~/hooks';
import { cn } from '~/lib/ui';
import type { MarkerId } from '~/types';
import { isVisitorPlaced, nextSelectedMarker, visitorMarkerFor } from '~/utils';
import { Globe } from '../Globe';
import { LegendButton } from '../LegendButton';
import { LocalClock } from '../LocalClock';
import { MarkerTooltip } from '../MarkerTooltip';

type GlobeCardProps = {
  className?: string;
};

export const GlobeCard = ({ className }: GlobeCardProps) => {
  const tooltipId = useId();
  const shown = useMediaQuery(GLOBE_CARD_QUERY, true);
  const visitor = useVisitor({ enabled: shown });
  const visitorDots = useVisitorDots();
  const [selectedMarker, setSelectedMarker] = useState<MarkerId | null>(null);

  const toggleMarker = (marker: MarkerId | null) =>
    setSelectedMarker((current) => nextSelectedMarker(current, marker));

  const visitorMarker = visitorMarkerFor(visitor);
  const describedByFor = (marker: MarkerId) =>
    selectedMarker === marker ? tooltipId : undefined;

  return (
    <div
      className={cn(
        'flex w-[30vw] min-w-0 flex-col items-center gap-2 sm:w-auto sm:flex-[0_1_340px] sm:gap-4',
        className,
      )}
    >
      <Globe
        className='motion-safe:animate-intro-globe motion-safe:[animation-delay:120ms]'
        onSelect={toggleMarker}
        selectedMarker={selectedMarker}
        sharedHome={visitor.sameCity}
        tooltip={
          selectedMarker !== null && (
            <MarkerTooltip marker={selectedMarker} visitor={visitor} />
          )
        }
        tooltipId={tooltipId}
        visitorCoords={visitor.coords}
        visitorDots={visitorDots}
      />
      <p className='motion-safe:animate-intro-rise text-center motion-safe:[animation-delay:380ms]'>
        <span className='text-muted-foreground block text-xs sm:text-base'>
          {HOME_CITY}
        </span>
        {shown && (
          <LocalClock className='font-serif text-base font-medium tabular-nums sm:text-[26px]' />
        )}
      </p>
      <div className='motion-safe:animate-intro-rise text-muted-foreground flex flex-wrap justify-center gap-x-1 text-sm motion-safe:[animation-delay:460ms] sm:-mt-4 sm:gap-x-2.5'>
        <LegendButton
          describedBy={describedByFor('home')}
          onClick={() => toggleMarker('home')}
          pressed={selectedMarker === 'home'}
          swatchClassName='bg-ink'
        >
          {HOME_MARKER_LABEL}
        </LegendButton>
        {isVisitorPlaced(visitor) && (
          <LegendButton
            describedBy={describedByFor(visitorMarker)}
            onClick={() => toggleMarker(visitorMarker)}
            pressed={selectedMarker === visitorMarker}
            swatchClassName='bg-coral ring-1 ring-coral-deep'
          >
            {visitor.label}
          </LegendButton>
        )}
      </div>
    </div>
  );
};
