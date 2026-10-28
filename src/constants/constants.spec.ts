import { describe, expect, it } from 'vitest';
import { BRANDS, LAND, PHOTOS, SECTIONS, STACK_GRID, WORK } from '~/constants';
import { TIME_ZONES } from './timezones';

const HEX = /^#[0-9a-f]{6}$/i;

describe('constants', () => {
  it('only references known brands', () => {
    const names = [...STACK_GRID, ...WORK.flatMap(({ tech }) => tech)];

    for (const name of names) {
      expect(BRANDS).toHaveProperty(name);
    }
  });

  it('has a colour and a path for every brand', () => {
    for (const brand of Object.values(BRANDS)) {
      expect(brand.color).toMatch(HEX);
      expect(brand.path.length).toBeGreaterThan(0);
    }
  });

  it('fills the four-column stack grid evenly', () => {
    expect(STACK_GRID.length % 4).toBe(0);
    expect(new Set(STACK_GRID).size).toBe(STACK_GRID.length);
  });

  it('gives each work entry one of the four scroll-spy timelines', () => {
    expect(WORK.map(({ id }) => id)).toEqual(['w1', 'w2', 'w3', 'w4']);
  });

  it('keeps collages to the three-tile layout', () => {
    for (const { collage } of WORK) {
      expect(collage?.length ?? 3).toBeLessThanOrEqual(3);
    }
  });

  it('has enough photos for the strip to loop without a gap', () => {
    expect(PHOTOS.length).toBeGreaterThanOrEqual(4);
  });

  it('has unique photo labels for stable keys', () => {
    const labels = PHOTOS.map(({ label }) => label);

    expect(new Set(labels).size).toBe(labels.length);
  });

  it('has unique section slugs', () => {
    const slugs = SECTIONS.map(({ slug }) => slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('stores land as in-range lat, lon pairs', () => {
    expect(LAND.length % 2).toBe(0);

    for (let i = 0; i < LAND.length; i += 2) {
      expect(Math.abs(LAND[i])).toBeLessThanOrEqual(90);
      expect(Math.abs(LAND[i + 1])).toBeLessThanOrEqual(180);
    }
  });

  it('places every time zone on the globe', () => {
    for (const [lat, lon] of Object.values(TIME_ZONES)) {
      expect(Math.abs(lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(lon)).toBeLessThanOrEqual(180);
    }

    expect(TIME_ZONES['America/Winnipeg']).toBeDefined();
  });
});
