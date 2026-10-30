import { REDUCED_MOTION_QUERY } from '~/constants';
import { useMediaQuery } from './useMediaQuery';

export const usePrefersReducedMotion = () =>
  useMediaQuery(REDUCED_MOTION_QUERY, false);
