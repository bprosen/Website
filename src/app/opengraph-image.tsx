import { ImageResponse } from 'next/og';
import { COLORS, NAME, OG_DESCRIPTION, SITE_TITLE } from '~/constants';

export const alt = SITE_TITLE;
export const contentType = 'image/png';
export const size = { height: 630, width: 1200 };

const Image = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: COLORS.paper,
        color: COLORS.ink,
        display: 'flex',
        height: '100%',
        justifyContent: 'space-between',
        padding: '0 96px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {NAME}
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.35, marginTop: 32 }}>
          {OG_DESCRIPTION}
        </div>
      </div>
      <div
        style={{
          background: COLORS.sage,
          border: `4px solid ${COLORS.ink}`,
          borderRadius: '50%',
          display: 'flex',
          height: 320,
          width: 320,
        }}
      />
    </div>,
    size,
  );

export default Image;
