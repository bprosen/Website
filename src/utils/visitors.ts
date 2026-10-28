import {
  DNT_HEADER,
  GEO_LATITUDE_HEADER,
  GEO_LONGITUDE_HEADER,
  GLOBE_NEAR_DEGREES,
  GPC_HEADER,
  HOME_CITY_SHORT,
  HOME_COORDS,
  VISITORS_KEY,
  VISITORS_MAX,
  VISITORS_TTL_MS,
} from '~/constants';
import type { LatLon } from '~/types';
import { isLatLon } from './geo';

export type RedisCommand = (string | number)[];

export type RedisConfig = { token: string; url: string };

const CELL_PATTERN = /^(-?\d{1,3}),(-?\d{1,3})$/;

const headerNumber = (headers: Headers, name: string) => {
  const value = headers.get(name)?.trim();
  return value ? Number(value) : Number.NaN;
};

export const parseGeoHeaders = (headers: Headers): LatLon | null => {
  const lat = headerNumber(headers, GEO_LATITUDE_HEADER);
  const lon = headerNumber(headers, GEO_LONGITUDE_HEADER);
  return isLatLon(lat, lon) ? [lat, lon] : null;
};

export const toCell = ([lat, lon]: LatLon): string => {
  const roundedLat = Math.round(lat) || 0;
  const roundedLon = Math.round(lon) || 0;
  return `${roundedLat},${roundedLon}`;
};

export const parseCells = (values: unknown): LatLon[] => {
  if (!Array.isArray(values)) {
    return [];
  }

  const cells: LatLon[] = [];
  for (const value of values) {
    const match = typeof value === 'string' ? CELL_PATTERN.exec(value) : null;
    if (!match) {
      continue;
    }
    const lat = Number(match[1]) || 0;
    const lon = Number(match[2]) || 0;
    if (isLatLon(lat, lon)) {
      cells.push([lat, lon]);
    }
  }
  return cells;
};

export const shouldRecord = (headers: Headers): boolean =>
  headers.get(GPC_HEADER)?.trim() !== '1' &&
  headers.get(DNT_HEADER)?.trim() !== '1';

export const buildPipeline = (
  cell: string | null,
  now: number,
): RedisCommand[] => [
  ...(cell ? [['ZADD', VISITORS_KEY, now, cell]] : []),
  ['ZREMRANGEBYSCORE', VISITORS_KEY, '-inf', now - VISITORS_TTL_MS],
  ['ZREMRANGEBYRANK', VISITORS_KEY, 0, -(VISITORS_MAX + 1)],
  ['ZREVRANGE', VISITORS_KEY, 0, VISITORS_MAX - 1],
];

export const parsePipelineResponse = (body: unknown): LatLon[] => {
  if (!Array.isArray(body) || body.length === 0) {
    return [];
  }
  const last: unknown = body[body.length - 1];
  if (typeof last !== 'object' || last === null || 'error' in last) {
    return [];
  }
  return 'result' in last ? parseCells(last.result) : [];
};

export const readRedisConfig = (
  env: Record<string, string | undefined>,
): RedisConfig | null => {
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  return url && token ? { token, url: url.replace(/\/+$/, '') } : null;
};

export type Visitor = {
  coords: LatLon | null;
  label: string;
  sameCity: boolean;
};

export const UNKNOWN_VISITOR: Visitor = {
  coords: null,
  label: 'You',
  sameCity: false,
};

const isNearHome = ([lat, lon]: LatLon) =>
  Math.abs(lat - HOME_COORDS[0]) < GLOBE_NEAR_DEGREES &&
  Math.abs(lon - HOME_COORDS[1]) < GLOBE_NEAR_DEGREES;

const cityFromZone = (zone: string) =>
  (zone.split('/').pop() ?? zone).replace(/_/g, ' ');

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
      label: `You're in ${HOME_CITY_SHORT} too`,
      sameCity: true,
    };
  }

  return { coords, label: `You, near ${cityFromZone(zone)}`, sameCity: false };
};
