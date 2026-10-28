import { VISITORS_ENDPOINT } from '~/constants';
import type { LatLon } from '~/types';
import { readLatLonList } from '~/utils';
import { requestJson } from './request';

const readVisitors = (body: unknown): LatLon[] =>
  typeof body === 'object' && body !== null && 'visitors' in body
    ? readLatLonList(body.visitors)
    : [];

export const recordVisit = (signal?: AbortSignal) =>
  requestJson(VISITORS_ENDPOINT, {
    fallback: [],
    method: 'POST',
    parse: readVisitors,
    signal,
  });
