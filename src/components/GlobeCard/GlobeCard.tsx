'use client';

import { useCallback, useId, useState } from 'react';
import { HOME_CITY } from '~/constants';
import { useVisitor, useVisitorDots } from '~/hooks';
import { type MarkerId, markerFor, nextTip } from '~/utils';
import { Globe } from '../Globe';
import { LegendButton } from '../LegendButton';
import { LocalClock } from '../LocalClock';
import { MarkerTooltip } from '../MarkerTooltip';

export const GlobeCard = () => {
  const tooltipId = useId();
  const visitor = useVisitor();
  const dots = useVisitorDots();
  const [tip, setTip] = useState<MarkerId | null>(null);

  const select = useCallback(
    (marker: MarkerId | null) => setTip((current) => nextTip(current, marker)),
    [],
  );

  const youMarker = markerFor('you', visitor);
  const describes = (marker: MarkerId) =>
    tip === marker ? tooltipId : undefined;

  return (
    <div className='flex min-w-0 flex-[0_1_340px] flex-col items-center gap-4'>
      <Globe
        dots={dots}
        onSelect={select}
        tip={tip}
        tooltip={tip && <MarkerTooltip marker={tip} visitor={visitor} />}
        tooltipId={tooltipId}
        visitorCoords={visitor.coords}
      />
      <p className='m-0 text-center'>
        <span className='block text-base text-muted-foreground'>
          {HOME_CITY}
        </span>
        <LocalClock className='font-serif text-[26px] font-medium tabular-nums' />
      </p>
      <p className='-mt-4 mb-0 flex flex-wrap justify-center gap-x-2.5 text-sm text-muted-foreground'>
        <LegendButton
          describedBy={describes('me')}
          onClick={() => select('me')}
          pressed={tip === 'me'}
          swatchClassName='bg-ink'
        >
          Me
        </LegendButton>
        <LegendButton
          describedBy={describes(youMarker)}
          onClick={() => select(youMarker)}
          pressed={tip === youMarker}
          swatchClassName='bg-coral'
        >
          {visitor.label}
        </LegendButton>
      </p>
    </div>
  );
};
