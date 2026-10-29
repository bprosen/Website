import type { CSSProperties } from 'react';
import { LIGHTBOX_MAX_SVH, LIGHTBOX_MAX_VW } from '~/constants';

export const fitToScreen = (width: number, height: number): CSSProperties => ({
  aspectRatio: `${width} / ${height}`,
  width: `min(${LIGHTBOX_MAX_VW}vw, ${LIGHTBOX_MAX_SVH}svh * ${width / height}, ${width}px)`,
});
