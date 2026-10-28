export const VISITORS_ENDPOINT = '/api/visitors';
export const VISITORS_KEY = 'visitors';
export const VISITORS_MAX = 150;
export const VISITORS_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const VISITORS_TIMEOUT_MS = 2000;

export const GEO_LATITUDE_HEADER = 'x-vercel-ip-latitude';
export const GEO_LONGITUDE_HEADER = 'x-vercel-ip-longitude';
export const GPC_HEADER = 'sec-gpc';
export const DNT_HEADER = 'dnt';

export const VISITORS_IDLE_FALLBACK_MS = 1500;
export const VISITORS_IDLE_TIMEOUT_MS = 4000;
export const REDIS_URL_ENV = 'UPSTASH_KV_REST_API_URL';
export const REDIS_TOKEN_ENV = 'UPSTASH_KV_REST_API_TOKEN';
