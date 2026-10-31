import { ImageResponse } from 'next/og';
import {
  BODY_FONT,
  COLORS,
  DISPLAY_FONT,
  FIRST_NAME,
  FULL_NAME,
  LAST_NAME,
  OG_DESCRIPTION,
  OG_IMAGE,
  SITE_DOMAIN,
} from '~/constants';
import {
  loadBodyFont,
  loadDisplayFont,
  loadPortraitDataUrl,
} from '~/lib/ogAssets';

export const alt = OG_IMAGE.alt;
export const contentType = 'image/png';
export const size = { height: OG_IMAGE.height, width: OG_IMAGE.width };

const PORTRAIT_PX = 340;

const OpengraphImage = async () => {
  const [portrait, bodyFont, displayFont] = await Promise.all([
    loadPortraitDataUrl(),
    loadBodyFont(),
    loadDisplayFont(),
  ]);

  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: COLORS.paper,
        color: COLORS.ink,
        display: 'flex',
        fontFamily: BODY_FONT.name,
        height: '100%',
        justifyContent: 'space-between',
        padding: '0 96px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 660 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: DISPLAY_FONT.name,
            fontSize: 112,
            fontWeight: DISPLAY_FONT.weight,
            letterSpacing: -4,
            lineHeight: 0.95,
          }}
        >
          <span>{FIRST_NAME}</span>
          <span>{LAST_NAME}</span>
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.35, marginTop: 36 }}>
          {OG_DESCRIPTION}
        </div>
        <div style={{ fontSize: 26, marginTop: 40, opacity: 0.6 }}>
          {SITE_DOMAIN}
        </div>
      </div>
      {/* biome-ignore lint/performance/noImgElement: ImageResponse renders with Satori, which only understands plain img elements. */}
      <img
        alt={FULL_NAME}
        height={PORTRAIT_PX}
        src={portrait}
        style={{
          border: `6px solid ${COLORS.ink}`,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
        width={PORTRAIT_PX}
      />
    </div>,
    { ...size, fonts: [bodyFont, displayFont] },
  );
};

export default OpengraphImage;
