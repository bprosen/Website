import { describe, expect, it } from 'vitest';
import {
  distanceFromHome,
  homeMarkerTitle,
  markerFor,
  nextTip,
} from './markers';
import { UNKNOWN_VISITOR, type Visitor } from './visitors';

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

describe('nextTip', () => {
  it('opens the requested marker', () => {
    expect(nextTip(null, 'me')).toBe('me');
    expect(nextTip('me', 'you')).toBe('you');
  });

  it('closes on a repeat selection or on null', () => {
    expect(nextTip('me', 'me')).toBeNull();
    expect(nextTip('you', null)).toBeNull();
    expect(nextTip(null, null)).toBeNull();
  });
});

describe('markerFor', () => {
  it('uses the visitor marker when they can be placed', () => {
    expect(markerFor('you', toronto)).toBe('you');
  });

  it('falls back to the home marker otherwise', () => {
    expect(markerFor('you', UNKNOWN_VISITOR)).toBe('me');
    expect(markerFor('you', local)).toBe('me');
  });

  it('never changes the home marker', () => {
    expect(markerFor('me', toronto)).toBe('me');
  });
});

describe('homeMarkerTitle', () => {
  it('names the home city', () => {
    expect(homeMarkerTitle(toronto)).toBe('Ben · Winnipeg, Canada');
  });

  it('mentions a visitor in the same city', () => {
    expect(homeMarkerTitle(local)).toBe(
      "Ben · Winnipeg, Canada · you're here too",
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
