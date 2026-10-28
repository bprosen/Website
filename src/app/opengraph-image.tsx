import { ImageResponse } from 'next/og';
import {
  BODY_FONT,
  COLORS,
  DISPLAY_FONT,
  FIRST_NAME,
  LAST_NAME,
  OG_DESCRIPTION,
  SITE_DOMAIN,
  SITE_TITLE,
} from '~/constants';
import { loadBodyFont, loadDisplayFont } from '~/lib/displayFont';

export const alt = SITE_TITLE;
export const contentType = 'image/png';
export const size = { height: 630, width: 1200 };

const Image = async () =>
  new ImageResponse(
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
      <div
        style={{
          alignItems: 'center',
          background: COLORS.sage,
          border: `5px solid ${COLORS.ink}`,
          borderRadius: '50%',
          display: 'flex',
          height: 340,
          justifyContent: 'center',
          width: 340,
        }}
      >
        <div
          style={{
            background: COLORS.ink,
            border: `6px solid ${COLORS.paper}`,
            borderRadius: '50%',
            display: 'flex',
            height: 44,
            marginLeft: -70,
            marginTop: -90,
            width: 44,
          }}
        />
      </div>
    </div>,
    { ...size, fonts: [await loadBodyFont(), await loadDisplayFont()] },
  );

export default Image;
