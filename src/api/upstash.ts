import { REDIS_TIMEOUT_MS } from '~/constants';
import type { LatLon, RedisCommand, RedisConfig } from '~/types';
import {
  buildRateLimitPipeline,
  parsePipelineResponse,
  parseRequestCount,
} from '~/utils';
import { requestJson } from './request';

export const runVisitorsPipeline = (
  { token, url }: RedisConfig,
  commands: RedisCommand[],
): Promise<LatLon[]> =>
  requestJson(`${url}/pipeline`, {
    body: commands,
    fallback: [],
    headers: { Authorization: `Bearer ${token}` },
    method: 'POST',
    parse: parsePipelineResponse,
    timeoutMs: REDIS_TIMEOUT_MS,
  });

export const countVisitorRequest = (
  { token, url }: RedisConfig,
  key: string,
): Promise<number> =>
  requestJson(`${url}/pipeline`, {
    body: buildRateLimitPipeline(key),
    fallback: 0,
    headers: { Authorization: `Bearer ${token}` },
    method: 'POST',
    parse: parseRequestCount,
    timeoutMs: REDIS_TIMEOUT_MS,
  });
