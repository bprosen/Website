import { ImageResponse } from 'next/og';
import { Monogram } from '~/components';
import { loadDisplayFont } from '~/lib/displayFont';

export const contentType = 'image/png';
export const size = { height: 64, width: 64 };

const Icon = async () =>
  new ImageResponse(<Monogram size={size.width} />, {
    ...size,
    fonts: [await loadDisplayFont()],
  });

export default Icon;
