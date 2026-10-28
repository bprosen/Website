// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { BODY_FONT, DISPLAY_FONT } from '~/constants';
import { loadBodyFont, loadDisplayFont } from './displayFont';

describe('loadDisplayFont', () => {
  it('loads the bundled display font for generated images', async () => {
    const font = await loadDisplayFont();

    expect(font.name).toBe(DISPLAY_FONT.name);
    expect(font.weight).toBe(DISPLAY_FONT.weight);
    expect(font.data.byteLength).toBeGreaterThan(10_000);
    expect(font.data.subarray(0, 4)).toEqual(Buffer.from([0, 1, 0, 0]));
  });

  it('loads the bundled body font', async () => {
    const font = await loadBodyFont();

    expect(font.name).toBe(BODY_FONT.name);
    expect(font.weight).toBe(BODY_FONT.weight);
    expect(font.data.subarray(0, 4)).toEqual(Buffer.from([0, 1, 0, 0]));
  });
});
