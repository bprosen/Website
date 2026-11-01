import {
  HOME_CITY_SHORT,
  HOME_COORDS,
  HOME_PROXIMITY_DEG,
  VISITOR_LABEL,
  VISITOR_NEAR_LABEL,
} from '~/constants';
import type { LatLon, Visitor, VisitorLocation } from '~/types';
import { isLatLonPair } from './geo';

export const UNKNOWN_VISITOR: Visitor = {
  coords: null,
  label: VISITOR_LABEL,
  sameCity: false,
};

const isNearHome = ([lat, lon]: LatLon) =>
  Math.abs(lat - HOME_COORDS[0]) < HOME_PROXIMITY_DEG &&
  Math.abs(lon - HOME_COORDS[1]) < HOME_PROXIMITY_DEG;

export const parseVisitorLocation = (
  value: unknown,
): VisitorLocation | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const coords = 'coords' in value ? value.coords : null;
  const city = 'city' in value ? value.city : null;

  if (!isLatLonPair(coords)) {
    return null;
  }

  return { city: typeof city === 'string' && city ? city : null, coords };
};

export const resolveVisitor = (location: VisitorLocation | null): Visitor => {
  if (!location) {
    return UNKNOWN_VISITOR;
  }

  if (isNearHome(location.coords)) {
    return {
      coords: null,
      label: `${VISITOR_LABEL} (${HOME_CITY_SHORT})`,
      sameCity: true,
    };
  }

  return {
    coords: location.coords,
    label: location.city
      ? `${VISITOR_NEAR_LABEL} ${location.city}`
      : VISITOR_LABEL,
    sameCity: false,
  };
};
