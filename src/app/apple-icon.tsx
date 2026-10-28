import { ImageResponse } from 'next/og';
import { Monogram } from '~/components';
import { loadDisplayFont } from '~/lib/ogAssets';

export const contentType = 'image/png';
export const size = { height: 180, width: 180 };

const AppleIcon = async () =>
  new ImageResponse(<Monogram rounded={false} size={size.width} />, {
    ...size,
    fonts: [await loadDisplayFont()],
  });

export default AppleIcon;
