import { VISITORS_TIMEOUT_MS } from '~/constants';
import type { LatLon } from '~/types';
import {
  parsePipelineResponse,
  type RedisCommand,
  type RedisConfig,
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
    timeoutMs: VISITORS_TIMEOUT_MS,
  });
