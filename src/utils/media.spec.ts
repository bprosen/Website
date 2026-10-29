import { describe, expect, it } from 'vitest';
import { LIGHTBOX_MAX_SVH, LIGHTBOX_MAX_VW } from '~/constants';
import { fitToScreen } from './media';

describe('fitToScreen', () => {
  it('keeps the shape of the media', () => {
    expect(fitToScreen(1600, 900).aspectRatio).toBe('1600 / 900');
  });

  it('fits the screen width and height without growing past the file size', () => {
    expect(fitToScreen(1200, 1600).width).toBe(
      `min(${LIGHTBOX_MAX_VW}vw, ${LIGHTBOX_MAX_SVH}svh * 0.75, 1200px)`,
    );
  });
});
