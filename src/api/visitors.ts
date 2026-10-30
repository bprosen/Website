import { VISITORS_ENDPOINT } from '~/constants';
import type { LatLon } from '~/types';
import { parseLatLonList } from '~/utils';
import { requestJson } from './request';

const parseVisitorsBody = (body: unknown): LatLon[] =>
  typeof body === 'object' && body !== null && 'visitors' in body
    ? parseLatLonList(body.visitors)
    : [];

export const recordVisit = (signal?: AbortSignal) =>
  requestJson(VISITORS_ENDPOINT, {
    fallback: [],
    method: 'POST',
    parse: parseVisitorsBody,
    signal,
  });
