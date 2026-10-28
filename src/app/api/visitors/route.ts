import { runVisitorsPipeline } from '~/api';
import type { LatLon } from '~/types';
import {
  buildPipeline,
  parseGeoHeaders,
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

export const POST = async (request: Request) => {
  const config = readRedisConfig(process.env);

  if (!config) {
    return respond([]);
  }

  const commands = buildPipeline(visitorCell(request.headers), Date.now());

  return respond(await runVisitorsPipeline(config, commands));
};
