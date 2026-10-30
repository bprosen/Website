import { describe, expect, it } from 'vitest';
import type { LatLon } from '~/types';
import { resolveVisitor, UNKNOWN_VISITOR } from './visitors';

const _geo = (lat?: string, lon?: string) => {
  const headers = new Headers();
  if (lat !== undefined) headers.set('x-vercel-ip-latitude', lat);
  if (lon !== undefined) headers.set('x-vercel-ip-longitude', lon);
  return headers;
};

describe('resolveVisitor', () => {
  const zones: Record<string, LatLon> = {
    'America/Argentina/Buenos_Aires': [-34.6, -58.5],
    'America/Winnipeg': [49.9, -97.2],
    'Europe/Paris': [48.9, 2.3],
  };

  it('is unknown for zones not in the table', () => {
    expect(resolveVisitor('Mars/Olympus', zones)).toBe(UNKNOWN_VISITOR);
    expect(resolveVisitor('', zones)).toBe(UNKNOWN_VISITOR);
  });

  it("doesn't read inherited object keys", () => {
    expect(resolveVisitor('toString', zones)).toBe(UNKNOWN_VISITOR);
  });

  it('recognizes visitors in Winnipeg and draws no second marker', () => {
    expect(resolveVisitor('America/Winnipeg', zones)).toEqual({
      coords: null,
      label: 'You (Winnipeg)',
      sameCity: true,
    });
  });

  it('places visitors at the same latitude but far away as distinct visitors', () => {
    expect(resolveVisitor('Europe/Paris', zones)).toEqual({
      coords: [48.9, 2.3],
      label: 'You, near Paris',
      sameCity: false,
    });
  });

  it('names the nearest city with spaces for underscores', () => {
    expect(resolveVisitor('America/Argentina/Buenos_Aires', zones)).toEqual({
      coords: [-34.6, -58.5],
      label: 'You, near Buenos Aires',
      sameCity: false,
    });
  });
});
