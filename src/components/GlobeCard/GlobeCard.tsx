'use client';

import { useCallback, useId, useState } from 'react';
import { HOME_CITY } from '~/constants';
import { useVisitor, useVisitorDots } from '~/hooks';
import { cn } from '~/lib/ui';
import { type MarkerId, markerFor, nextTip } from '~/utils';
import { Globe } from '../Globe';
import { LegendButton } from '../LegendButton';
import { LocalClock } from '../LocalClock';
import { MarkerTooltip } from '../MarkerTooltip';

type GlobeCardProps = {
  className?: string;
};

export const GlobeCard = ({ className }: GlobeCardProps) => {
  const tooltipId = useId();
  const visitor = useVisitor();
  const dots = useVisitorDots();
  const [tip, setTip] = useState<MarkerId | null>(null);

  const select = useCallback(
    (marker: MarkerId | null) => setTip((current) => nextTip(current, marker)),
    [],
  );

  const youMarker = markerFor('you', visitor);
  const placed = visitor.coords !== null || visitor.sameCity;
  const describes = (marker: MarkerId) =>
    tip === marker ? tooltipId : undefined;

  return (
    <div
      className={cn(
        'flex w-[30vw] min-w-0 flex-col items-center gap-2 sm:w-auto sm:flex-[0_1_340px] sm:gap-4',
        className,
      )}
    >
      <Globe
        className='motion-safe:animate-intro-globe motion-safe:[animation-delay:120ms]'
        dots={dots}
        onSelect={select}
        sharedHome={visitor.sameCity}
        tip={tip}
        tooltip={tip && <MarkerTooltip marker={tip} visitor={visitor} />}
        tooltipId={tooltipId}
        visitorCoords={visitor.coords}
      />
      <p className='m-0 text-center motion-safe:animate-intro-rise motion-safe:[animation-delay:380ms]'>
        <span className='block text-xs text-muted-foreground sm:text-base'>
          {HOME_CITY}
        </span>
        <LocalClock className='font-serif text-base font-medium tabular-nums sm:text-[26px]' />
      </p>
      <p className='m-0 flex flex-wrap justify-center motion-safe:animate-intro-rise motion-safe:[animation-delay:460ms] gap-x-1 text-sm text-muted-foreground sm:-mt-4 sm:gap-x-2.5'>
        <LegendButton
          describedBy={describes('me')}
          onClick={() => select('me')}
          pressed={tip === 'me'}
          swatchClassName='bg-ink'
        >
          Me
        </LegendButton>
        {placed && (
          <LegendButton
            describedBy={describes(youMarker)}
            onClick={() => select(youMarker)}
            pressed={tip === youMarker}
            swatchClassName='bg-coral ring-1 ring-coral-deep'
          >
            {visitor.label}
          </LegendButton>
        )}
      </p>
    </div>
  );
};
