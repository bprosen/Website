import {
  CLIENT_IP_HEADER,
  DNT_HEADER,
  FETCH_SITE_HEADER,
  FORWARDED_FOR_HEADER,
  GEO_LATITUDE_HEADER,
  GEO_LONGITUDE_HEADER,
  GPC_HEADER,
  HOST_HEADER,
  ORIGIN_HEADER,
  REDIS_TOKEN_ENV,
  REDIS_URL_ENV,
  SAME_ORIGIN,
  VISITORS_MAX_COUNT,
  VISITORS_RATE_KEY_PREFIX,
  VISITORS_RATE_WINDOW_SECONDS,
  VISITORS_REDIS_KEY,
  VISITORS_TTL_MS,
} from '~/constants';
import type { LatLon, RedisCommand, RedisConfig } from '~/types';
import { isLatLon } from './geo';

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

const originHost = (origin: string) => {
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
};

export const isSameOriginRequest = (headers: Headers) => {
  const fetchSite = headers.get(FETCH_SITE_HEADER);

  if (fetchSite !== null) {
    return fetchSite === SAME_ORIGIN;
  }

  const origin = headers.get(ORIGIN_HEADER);
  const host = headers.get(HOST_HEADER);
  return origin !== null && host !== null && originHost(origin) === host;
};

export const clientAddress = (headers: Headers) =>
  headers.get(CLIENT_IP_HEADER)?.trim() ||
  headers.get(FORWARDED_FOR_HEADER)?.split(',')[0]?.trim() ||
  null;

export const rateLimitKey = async (address: string) => {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(address),
  );
  const hex = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return `${VISITORS_RATE_KEY_PREFIX}${hex}`;
};

export const buildRateLimitPipeline = (key: string): RedisCommand[] => [
  ['INCR', key],
  ['EXPIRE', key, VISITORS_RATE_WINDOW_SECONDS, 'NX'],
];

export const parseRequestCount = (body: unknown): number => {
  const first: unknown = Array.isArray(body) ? body[0] : null;

  return typeof first === 'object' &&
    first !== null &&
    'result' in first &&
    typeof first.result === 'number'
    ? first.result
    : 0;
};

export const buildPipeline = (
  cell: string | null,
  now: number,
): RedisCommand[] => [
  ...(cell ? [['ZADD', VISITORS_REDIS_KEY, now, cell]] : []),
  ['ZREMRANGEBYSCORE', VISITORS_REDIS_KEY, '-inf', now - VISITORS_TTL_MS],
  ['ZREMRANGEBYRANK', VISITORS_REDIS_KEY, 0, -(VISITORS_MAX_COUNT + 1)],
  ['ZREVRANGE', VISITORS_REDIS_KEY, 0, VISITORS_MAX_COUNT - 1],
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
  const url = env[REDIS_URL_ENV];
  const token = env[REDIS_TOKEN_ENV];
  return url && token ? { token, url: url.replace(/\/+$/, '') } : null;
};
