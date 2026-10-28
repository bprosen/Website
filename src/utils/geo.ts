import { EARTH_DIAMETER_KM } from '~/constants';
import type { LatLon } from '~/types';

const RAD = Math.PI / 180;

export const isLatLon = (lat: number, lon: number) =>
  Number.isFinite(lat) &&
  Number.isFinite(lon) &&
  Math.abs(lat) <= 90 &&
  Math.abs(lon) <= 180;

const isLatLonPair = (value: unknown): value is LatLon =>
  Array.isArray(value) &&
  value.length === 2 &&
  typeof value[0] === 'number' &&
  typeof value[1] === 'number' &&
  isLatLon(value[0], value[1]);

export const readLatLonList = (value: unknown): LatLon[] =>
  Array.isArray(value) ? value.filter(isLatLonPair) : [];

export const haversineKm = ([lat1, lon1]: LatLon, [lat2, lon2]: LatLon) => {
  const dLat = (lat2 - lat1) * RAD;
  const dLon = (lon2 - lon1) * RAD;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLon / 2) ** 2;

  return Math.round((EARTH_DIAMETER_KM * Math.asin(Math.sqrt(h))) / 10) * 10;
};
