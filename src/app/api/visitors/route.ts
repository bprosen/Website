import { userAgent } from 'next/server';
import { countVisitorRequest, runVisitorsPipeline } from '~/api';
import { VISITORS_RATE_LIMIT } from '~/constants';
import type { LatLon, RedisConfig, VisitorLocation } from '~/types';
import {
  buildPipeline,
  clientAddress,
  isSameOriginRequest,
  locationFromHeaders,
  rateLimitKey,
  readRedisConfig,
  shouldRecord,
  toCell,
} from '~/utils';

const respond = (visitors: LatLon[], location: VisitorLocation | null) =>
  Response.json(
    { location, visitors },
    { headers: { 'Cache-Control': 'no-store' } },
  );

const visitorCell = (headers: Headers, location: VisitorLocation | null) => {
  const recordable = shouldRecord(headers) && !userAgent({ headers }).isBot;
  return recordable && location ? toCell(location.coords) : null;
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
  if (!isSameOriginRequest(request.headers)) {
    return respond([], null);
  }

  const location = locationFromHeaders(request.headers);
  const config = readRedisConfig(process.env);

  if (!config || (await isRateLimited(config, request.headers))) {
    return respond([], location);
  }

  const commands = buildPipeline(
    visitorCell(request.headers, location),
    Date.now(),
  );

  return respond(await runVisitorsPipeline(config, commands), location);
};
