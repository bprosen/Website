import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ABOUT_PHOTOS,
  BRANDS,
  LAND,
  PORTRAIT,
  RESUME_PATH,
  SECTIONS,
  STACK_BRANDS,
  WORK,
} from '~/constants';
import type { MediaSlot } from '~/types';
import { TIME_ZONES } from './timezones';

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const JPEG_START_OF_FRAME_MARKERS = new Set([0xc0, 0xc1, 0xc2]);

const publicFile = (path: string) => join(process.cwd(), 'public', path);

const jpegSize = (path: string) => {
  const bytes = readFileSync(publicFile(path));
  let offset = 2;

  while (offset < bytes.length) {
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);

    if (JPEG_START_OF_FRAME_MARKERS.has(marker)) {
      return {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + length;
  }

  return null;
};

const mediaSlots: readonly MediaSlot[] = [
  ...ABOUT_PHOTOS,
  ...WORK.flatMap(({ collage }) => collage ?? []),
];

describe('constants', () => {
  it('only references known brands', () => {
    const names = [...STACK_BRANDS, ...WORK.flatMap(({ tech }) => tech)];

    for (const name of names) {
      expect(BRANDS).toHaveProperty(name);
    }
  });

  it('has a color and a path for every brand', () => {
    for (const brand of Object.values(BRANDS)) {
      expect(brand.color).toMatch(HEX_COLOR_PATTERN);
      expect(brand.path.length).toBeGreaterThan(0);
    }
  });

  it('links every brand to its https site', () => {
    for (const brand of Object.values(BRANDS)) {
      expect(new URL(brand.url).protocol).toBe('https:');
    }
  });

  it('fills the four-column stack grid evenly', () => {
    expect(STACK_BRANDS.length % 4).toBe(0);
    expect(new Set(STACK_BRANDS).size).toBe(STACK_BRANDS.length);
  });

  it('gives each work entry one of the four CSS view timelines', () => {
    expect(WORK.map(({ id }) => id)).toEqual(['w1', 'w2', 'w3', 'w4']);
  });

  it('keeps collages to the three-tile layout', () => {
    for (const { collage } of WORK) {
      expect(collage?.length ?? 3).toBeLessThanOrEqual(3);
    }
  });

  it('has enough photos for the strip to loop without a gap', () => {
    expect(ABOUT_PHOTOS.length).toBeGreaterThanOrEqual(4);
  });

  it('has unique photo labels for stable keys', () => {
    const labels = ABOUT_PHOTOS.map(({ label }) => label);

    expect(new Set(labels).size).toBe(labels.length);
  });

  it('has unique labels within each collage for stable keys', () => {
    for (const { collage = [] } of WORK) {
      const labels = collage.map(({ label }) => label);

      expect(new Set(labels).size).toBe(labels.length);
    }
  });

  it('points every media slot at a file in public/', () => {
    for (const { src, video } of mediaSlots) {
      for (const path of [src, video]) {
        if (path !== undefined) {
          expect(existsSync(publicFile(path)), path).toBe(true);
        }
      }
    }

    expect(existsSync(publicFile(PORTRAIT.src))).toBe(true);
    expect(existsSync(publicFile(RESUME_PATH))).toBe(true);
  });

  it('declares the real pixel size of every image', () => {
    for (const { height, src, width } of [...mediaSlots, PORTRAIT]) {
      if (src !== undefined) {
        expect(jpegSize(src), src).toEqual({ height, width });
      }
    }
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

  it('places zones that browsers report under their own name', () => {
    for (const zone of [
      'America/Cordoba',
      'Asia/Kuala_Lumpur',
      'Europe/Amsterdam',
      'Europe/Oslo',
      'Europe/Stockholm',
      'Pacific/Truk',
    ]) {
      expect(TIME_ZONES, zone).toHaveProperty([zone]);
    }
  });
});
