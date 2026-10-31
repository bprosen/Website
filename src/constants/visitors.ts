import { MS_PER_DAY } from './time';

export const VISITORS_ENDPOINT = '/api/visitors';
export const VISITORS_IDLE_FALLBACK_MS = 1500;
export const VISITORS_IDLE_TIMEOUT_MS = 4000;
export const HOME_PROXIMITY_DEG = 1.5;

export const VISITORS_REDIS_KEY = 'visitors';
export const VISITORS_MAX_COUNT = 150;
export const VISITORS_TTL_MS = 30 * MS_PER_DAY;

export const GEO_LATITUDE_HEADER = 'x-vercel-ip-latitude';
export const GEO_LONGITUDE_HEADER = 'x-vercel-ip-longitude';
export const GPC_HEADER = 'sec-gpc';
export const DNT_HEADER = 'dnt';
export const FETCH_SITE_HEADER = 'sec-fetch-site';
export const SAME_ORIGIN = 'same-origin';
export const ORIGIN_HEADER = 'origin';
export const HOST_HEADER = 'host';
export const CLIENT_IP_HEADER = 'x-real-ip';
export const FORWARDED_FOR_HEADER = 'x-forwarded-for';

export const VISITORS_RATE_LIMIT = 10;
export const VISITORS_RATE_WINDOW_SECONDS = 60;
export const VISITORS_RATE_KEY_PREFIX = 'visitors:rate:';
