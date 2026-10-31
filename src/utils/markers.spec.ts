import { describe, expect, it } from 'vitest';
import { FIRST_NAME, HOME_CITY, SAME_CITY_NOTE } from '~/constants';
import type { Visitor } from '~/types';
import {
  distanceFromHome,
  homeMarkerTitle,
  isVisitorPlaced,
  nextSelectedMarker,
  visitorMarkerFor,
} from './markers';
import { UNKNOWN_VISITOR } from './visitors';

const toronto: Visitor = {
  coords: [43.6, -79.4],
  label: 'You, near Toronto',
  sameCity: false,
};
const local: Visitor = {
  coords: null,
  label: 'You (Winnipeg)',
  sameCity: true,
};

describe('nextSelectedMarker', () => {
  it('opens the requested marker', () => {
    expect(nextSelectedMarker(null, 'home')).toBe('home');
    expect(nextSelectedMarker('home', 'visitor')).toBe('visitor');
  });

  it('closes on a repeat selection or on null', () => {
    expect(nextSelectedMarker('home', 'home')).toBeNull();
    expect(nextSelectedMarker('visitor', null)).toBeNull();
    expect(nextSelectedMarker(null, null)).toBeNull();
  });
});

describe('visitorMarkerFor', () => {
  it('uses the visitor marker when they can be placed', () => {
    expect(visitorMarkerFor(toronto)).toBe('visitor');
  });

  it('falls back to the home marker otherwise', () => {
    expect(visitorMarkerFor(UNKNOWN_VISITOR)).toBe('home');
    expect(visitorMarkerFor(local)).toBe('home');
  });
});

describe('isVisitorPlaced', () => {
  it('places visitors with a location or in the same city', () => {
    expect(isVisitorPlaced(toronto)).toBe(true);
    expect(isVisitorPlaced(local)).toBe(true);
  });

  it("doesn't place visitors it knows nothing about", () => {
    expect(isVisitorPlaced(UNKNOWN_VISITOR)).toBe(false);
  });
});

describe('homeMarkerTitle', () => {
  it('names the home city', () => {
    expect(homeMarkerTitle(toronto)).toBe(`${FIRST_NAME} · ${HOME_CITY}`);
  });

  it('mentions a visitor in the same city', () => {
    expect(homeMarkerTitle(local)).toBe(
      `${FIRST_NAME} · ${HOME_CITY} · ${SAME_CITY_NOTE}`,
    );
  });
});

describe('distanceFromHome', () => {
  it('formats the distance to Winnipeg', () => {
    expect(distanceFromHome([43.6, -79.4])).toMatch(
      /^1,5\d0 km from Winnipeg$/,
    );
  });
});
