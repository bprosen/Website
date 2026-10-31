import { LOCAL_TIME_PREFIX, LOCAL_TIME_SUFFIX } from '~/constants';
import type { MarkerId, Visitor } from '~/types';
import { distanceFromHome, homeMarkerTitle } from '~/utils';
import { LocalClock } from '../LocalClock';

type MarkerTooltipProps = {
  marker: MarkerId;
  visitor: Visitor;
};

export const MarkerTooltip = ({ marker, visitor }: MarkerTooltipProps) => {
  if (marker === 'visitor' && visitor.coords) {
    return (
      <>
        <strong className='block font-semibold'>{visitor.label}</strong>
        <span className='text-mist'>{distanceFromHome(visitor.coords)}</span>
      </>
    );
  }

  return (
    <>
      <strong className='block font-semibold'>
        {homeMarkerTitle(visitor)}
      </strong>
      <span className='text-mist'>
        {LOCAL_TIME_PREFIX} <LocalClock className='tabular-nums' />{' '}
        {LOCAL_TIME_SUFFIX}
      </span>
    </>
  );
};
