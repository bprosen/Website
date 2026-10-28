'use client';

import {
  distanceFromHome,
  homeMarkerTitle,
  type MarkerId,
  type Visitor,
} from '~/utils';
import { LocalClock } from '../LocalClock';

type MarkerTooltipProps = {
  marker: MarkerId;
  visitor: Visitor;
};

export const MarkerTooltip = ({ marker, visitor }: MarkerTooltipProps) => {
  const visitorCoords = marker === 'you' ? visitor.coords : null;

  return (
    <>
      <strong className='block font-semibold'>
        {visitorCoords ? visitor.label : homeMarkerTitle(visitor)}
      </strong>
      <span className='text-mist'>
        {visitorCoords ? (
          distanceFromHome(visitorCoords)
        ) : (
          <>
            It's <LocalClock className='tabular-nums' /> here
          </>
        )}
      </span>
    </>
  );
};
