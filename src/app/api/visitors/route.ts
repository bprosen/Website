import { countVisitorRequest, runVisitorsPipeline } from '~/api';
import { VISITORS_RATE_LIMIT } from '~/constants';
import type { LatLon, RedisConfig } from '~/types';
import {
  buildPipeline,
  clientAddress,
  isSameOriginRequest,
  parseGeoHeaders,
  rateLimitKey,
  readRedisConfig,
  shouldRecord,
  toCell,
} from '~/utils';

const respond = (visitors: LatLon[]) =>
  Response.json({ visitors }, { headers: { 'Cache-Control': 'no-store' } });

const visitorCell = (headers: Headers) => {
  const coords = shouldRecord(headers) ? parseGeoHeaders(headers) : null;
  return coords ? toCell(coords) : null;
};

const isRateLimited = async (config: RedisConfig, headers: Headers) => {
  const address = clientAddress(headers);

  if (address === null) {
    return false;
  }

  const requests = await countVisitorRequest(
    config,
    await rateLimitKey(address),
  );
  return requests > VISITORS_RATE_LIMIT;
};

export const POST = async (request: Request) => {
  const config = readRedisConfig(process.env);

  if (!config || !isSameOriginRequest(request.headers)) {
    return respond([]);
  }

  if (await isRateLimited(config, request.headers)) {
    return respond([]);
  }

  const commands = buildPipeline(visitorCell(request.headers), Date.now());

  return respond(await runVisitorsPipeline(config, commands));
};
