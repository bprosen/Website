import { ImageResponse } from 'next/og';
import { describe, expect, it } from 'vitest';
import { SITE_TITLE } from '~/constants';
import OpengraphImage, { alt, contentType, size } from './opengraph-image';

describe('opengraph image', () => {
  it('describes a 1200x630 PNG card', () => {
    expect(alt).toBe(SITE_TITLE);
    expect(contentType).toBe('image/png');
    expect(size).toEqual({ height: 630, width: 1200 });
  });

  it('renders an image response', async () => {
    await expect(OpengraphImage()).resolves.toBeInstanceOf(ImageResponse);
  });
});
