import {
  DISTANCE_UNIT,
  FIRST_NAME,
  HOME_CITY,
  HOME_CITY_SHORT,
  HOME_COORDS,
  LOCALE,
  SAME_CITY_NOTE,
  TITLE_SEPARATOR,
} from '~/constants';
import type { LatLon, MarkerId, Visitor } from '~/types';
import { haversineKm } from './geo';

export const nextSelectedMarker = (
  current: MarkerId | null,
  requested: MarkerId | null,
): MarkerId | null =>
  requested === null || requested === current ? null : requested;

export const visitorMarkerFor = (visitor: Visitor): MarkerId =>
  visitor.coords ? 'visitor' : 'home';

export const isVisitorPlaced = (visitor: Visitor) =>
  visitor.coords !== null || visitor.sameCity;

export const homeMarkerTitle = (visitor: Visitor) =>
  [FIRST_NAME, HOME_CITY, ...(visitor.sameCity ? [SAME_CITY_NOTE] : [])].join(
    TITLE_SEPARATOR,
  );

export const distanceFromHome = (coords: LatLon) =>
  `${haversineKm(HOME_COORDS, coords).toLocaleString(LOCALE)} ${DISTANCE_UNIT} ${HOME_CITY_SHORT}`;
