import {
  FIRST_NAME,
  HOME_CITY,
  HOME_CITY_SHORT,
  HOME_COORDS,
} from '~/constants';
import type { LatLon } from '~/types';
import { haversineKm } from './geo';
import type { Visitor } from './visitors';

export type MarkerId = 'me' | 'you';

export const nextTip = (
  current: MarkerId | null,
  requested: MarkerId | null,
): MarkerId | null =>
  requested === null || requested === current ? null : requested;

export const markerFor = (requested: MarkerId, visitor: Visitor): MarkerId =>
  requested === 'you' && !visitor.coords ? 'me' : requested;

export const homeMarkerTitle = (visitor: Visitor) =>
  visitor.sameCity
    ? `${FIRST_NAME} · ${HOME_CITY} · you're here too`
    : `${FIRST_NAME} · ${HOME_CITY}`;

export const distanceFromHome = (coords: LatLon) =>
  `${haversineKm(HOME_COORDS, coords).toLocaleString('en-CA')} km from ${HOME_CITY_SHORT}`;
