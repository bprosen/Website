import { describe, expect, it } from 'vitest';
import { HOME_COORDS } from '~/constants';
import { haversineKm, isLatLon, readLatLonList } from './geo';

describe('isLatLon', () => {
  it('accepts finite in-range coordinates', () => {
    expect(isLatLon(0, 0)).toBe(true);
    expect(isLatLon(-90, 180)).toBe(true);
  });

  it('rejects out-of-range and non-finite values', () => {
    expect(isLatLon(91, 0)).toBe(false);
    expect(isLatLon(0, -181)).toBe(false);
    expect(isLatLon(Number.NaN, 0)).toBe(false);
    expect(isLatLon(0, Number.POSITIVE_INFINITY)).toBe(false);
  });
});

describe('readLatLonList', () => {
  it('keeps valid pairs only', () => {
    expect(
      readLatLonList([
        [50, -97],
        [91, 0],
        [0, 181],
        ['1', 2],
        [1],
        [1, 2, 3],
        null,
        [-90, 180],
      ]),
    ).toEqual([
      [50, -97],
      [-90, 180],
    ]);
  });

  it('returns an empty list for non-arrays', () => {
    expect(readLatLonList(undefined)).toEqual([]);
    expect(readLatLonList({ 0: [1, 2] })).toEqual([]);
  });
});

describe('haversineKm', () => {
  it('is zero for the same point', () => {
    expect(haversineKm([10, 10], [10, 10])).toBe(0);
  });

  it('measures Winnipeg to Toronto, rounded to 10 km', () => {
    const km = haversineKm(HOME_COORDS, [43.6, -79.4]);

    expect(km % 10).toBe(0);
    expect(km).toBeGreaterThan(1480);
    expect(km).toBeLessThan(1540);
  });

  it('measures half the planet for antipodes', () => {
    expect(haversineKm([0, 0], [0, 180])).toBe(20020);
  });
});
