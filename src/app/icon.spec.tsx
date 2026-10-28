import { ImageResponse } from 'next/og';
import { describe, expect, it } from 'vitest';
import AppleIcon, { size as appleSize } from './apple-icon';
import Icon, { contentType, size } from './icon';

describe('app icons', () => {
  it('renders the tab icon as a square PNG', async () => {
    expect(contentType).toBe('image/png');
    expect(size.width).toBe(size.height);
    await expect(Icon()).resolves.toBeInstanceOf(ImageResponse);
  });

  it('renders the home screen icon at Apple size', async () => {
    expect(appleSize).toEqual({ height: 180, width: 180 });
    await expect(AppleIcon()).resolves.toBeInstanceOf(ImageResponse);
  });
});
