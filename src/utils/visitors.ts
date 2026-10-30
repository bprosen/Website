import {
  HOME_CITY_SHORT,
  HOME_COORDS,
  HOME_PROXIMITY_DEG,
  VISITOR_LABEL,
  VISITOR_NEAR_LABEL,
} from '~/constants';
import type { LatLon, Visitor } from '~/types';

export const UNKNOWN_VISITOR: Visitor = {
  coords: null,
  label: VISITOR_LABEL,
  sameCity: false,
};

const isNearHome = ([lat, lon]: LatLon) =>
  Math.abs(lat - HOME_COORDS[0]) < HOME_PROXIMITY_DEG &&
  Math.abs(lon - HOME_COORDS[1]) < HOME_PROXIMITY_DEG;

const cityFromZone = (zone: string) =>
  (zone.split('/').pop() ?? zone).replaceAll('_', ' ');

export const resolveVisitor = (
  zone: string,
  zones: Readonly<Record<string, LatLon>>,
): Visitor => {
  const coords = Object.hasOwn(zones, zone) ? zones[zone] : undefined;

  if (!coords) {
    return UNKNOWN_VISITOR;
  }

  if (isNearHome(coords)) {
    return {
      coords: null,
      label: `${VISITOR_LABEL} (${HOME_CITY_SHORT})`,
      sameCity: true,
    };
  }

  return {
    coords,
    label: `${VISITOR_NEAR_LABEL} ${cityFromZone(zone)}`,
    sameCity: false,
  };
};
