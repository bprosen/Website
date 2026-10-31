import { describe, expect, it } from 'vitest';
import {
  LIGHTBOX_MAX_SVH,
  LIGHTBOX_MAX_VW,
  LIGHTBOX_RESERVE_X_VAR,
  LIGHTBOX_RESERVE_Y_VAR,
  SWIPE_THRESHOLD_PX,
} from '~/constants';
import {
  fitToScreen,
  lightboxSizes,
  mediaPosition,
  swipeStep,
  toLightboxItems,
  wrapIndex,
} from './media';

describe('fitToScreen', () => {
  it('keeps the shape of the media', () => {
    expect(fitToScreen(1600, 900).aspectRatio).toBe('1600 / 900');
  });

  it('fits the screen, minus any space reserved for controls, without growing past the file size', () => {
    expect(fitToScreen(1200, 1600).width).toBe(
      `min(calc(${LIGHTBOX_MAX_VW}vw - var(${LIGHTBOX_RESERVE_X_VAR}, 0px)), calc((${LIGHTBOX_MAX_SVH}svh - var(${LIGHTBOX_RESERVE_Y_VAR}, 0px)) * 0.75), 1200px)`,
    );
  });
});

describe('lightboxSizes', () => {
  it('requests only as many pixels as the lightbox renders', () => {
    expect(lightboxSizes(1200, 1600)).toBe(
      `min(${LIGHTBOX_MAX_VW}vw, ${LIGHTBOX_MAX_SVH * 0.75}vh, 1200px)`,
    );
  });
});

describe('toLightboxItems', () => {
  it('keeps only slots with media and falls back to the label for alt text', () => {
    expect(
      toLightboxItems([
        { label: 'Placeholder' },
        { height: 300, label: 'Hub', src: '/hub.jpg', width: 400 },
        {
          alt: 'Run',
          height: 450,
          label: 'Clip',
          src: '/clip.jpg',
          video: '/clip.mp4',
          width: 800,
        },
      ]),
    ).toEqual([
      {
        alt: 'Hub',
        height: 300,
        src: '/hub.jpg',
        video: undefined,
        width: 400,
      },
      {
        alt: 'Run',
        height: 450,
        src: '/clip.jpg',
        video: '/clip.mp4',
        width: 800,
      },
    ]);
  });
});

describe('wrapIndex', () => {
  it('wraps past either end', () => {
    expect(wrapIndex(3, 3)).toBe(0);
    expect(wrapIndex(-1, 3)).toBe(2);
    expect(wrapIndex(1, 3)).toBe(1);
  });
});

describe('swipeStep', () => {
  it('steps forward on a left swipe and back on a right swipe', () => {
    expect(swipeStep(-SWIPE_THRESHOLD_PX, 0)).toBe(1);
    expect(swipeStep(SWIPE_THRESHOLD_PX, 0)).toBe(-1);
  });

  it('ignores short or mostly vertical swipes', () => {
    expect(swipeStep(-(SWIPE_THRESHOLD_PX - 1), 0)).toBe(0);
    expect(swipeStep(-80, 120)).toBe(0);
  });
});

describe('mediaPosition', () => {
  it('counts from one', () => {
    expect(mediaPosition(0, 4)).toBe('1 of 4');
  });
});
