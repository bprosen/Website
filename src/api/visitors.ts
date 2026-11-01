import { VISITORS_ENDPOINT } from '~/constants';
import type { VisitorsSnapshot } from '~/types';
import { parseLatLonList, parseVisitorLocation } from '~/utils';
import { requestJson } from './request';

const EMPTY_SNAPSHOT: VisitorsSnapshot = { dots: [], location: null };

const parseVisitorsBody = (body: unknown): VisitorsSnapshot =>
  typeof body === 'object' && body !== null
    ? {
        dots: 'visitors' in body ? parseLatLonList(body.visitors) : [],
        location:
          'location' in body ? parseVisitorLocation(body.location) : null,
      }
    : EMPTY_SNAPSHOT;

export const recordVisit = (signal?: AbortSignal) =>
  requestJson(VISITORS_ENDPOINT, {
    fallback: EMPTY_SNAPSHOT,
    method: 'POST',
    parse: parseVisitorsBody,
    signal,
  });
