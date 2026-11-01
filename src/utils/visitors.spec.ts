import { describe, expect, it } from 'vitest';
import {
  parseVisitorLocation,
  resolveVisitor,
  UNKNOWN_VISITOR,
} from './visitors';

describe('resolveVisitor', () => {
  it('is unknown without a location', () => {
    expect(resolveVisitor(null)).toBe(UNKNOWN_VISITOR);
  });

  it('recognizes visitors in Winnipeg and draws no second marker', () => {
    expect(
      resolveVisitor({ city: 'Winnipeg', coords: [49.8951, -97.1384] }),
    ).toEqual({
      coords: null,
      label: 'You (Winnipeg)',
      sameCity: true,
    });
  });

  it('treats visitors far north of Winnipeg as distinct visitors', () => {
    expect(
      resolveVisitor({ city: 'Rankin Inlet', coords: [62.8, -92.1] }),
    ).toEqual({
      coords: [62.8, -92.1],
      label: 'You, near Rankin Inlet',
      sameCity: false,
    });
  });

  it('places visitors at the same latitude but far away as distinct visitors', () => {
    expect(resolveVisitor({ city: 'Paris', coords: [48.9, 2.3] })).toEqual({
      coords: [48.9, 2.3],
      label: 'You, near Paris',
      sameCity: false,
    });
  });

  it('places visitors without a known city under a plain label', () => {
    expect(resolveVisitor({ city: null, coords: [48.9, 2.3] })).toEqual({
      coords: [48.9, 2.3],
      label: 'You',
      sameCity: false,
    });
  });
});

describe('parseVisitorLocation', () => {
  it('reads the city and coordinates', () => {
    expect(
      parseVisitorLocation({ city: 'Toronto', coords: [43.6, -79.4] }),
    ).toEqual({ city: 'Toronto', coords: [43.6, -79.4] });
  });

  it('keeps the coordinates when the city is missing or empty', () => {
    expect(parseVisitorLocation({ coords: [43.6, -79.4] })).toEqual({
      city: null,
      coords: [43.6, -79.4],
    });
    expect(parseVisitorLocation({ city: '', coords: [43.6, -79.4] })).toEqual({
      city: null,
      coords: [43.6, -79.4],
    });
    expect(parseVisitorLocation({ city: 7, coords: [43.6, -79.4] })).toEqual({
      city: null,
      coords: [43.6, -79.4],
    });
  });

  it('rejects anything without valid coordinates', () => {
    expect(parseVisitorLocation(null)).toBeNull();
    expect(parseVisitorLocation('Toronto')).toBeNull();
    expect(parseVisitorLocation({ city: 'Toronto' })).toBeNull();
    expect(
      parseVisitorLocation({ city: 'Toronto', coords: [91, 0] }),
    ).toBeNull();
  });
});
