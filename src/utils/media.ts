import type { CSSProperties } from 'react';
import {
  LIGHTBOX_MAX_SVH,
  LIGHTBOX_MAX_VW,
  LIGHTBOX_RESERVE_X_VAR,
  LIGHTBOX_RESERVE_Y_VAR,
  MEDIA_POSITION_SEPARATOR,
  SWIPE_THRESHOLD_PX,
} from '~/constants';
import type { LightboxItem, MediaSlot } from '~/types';

export const fitToScreen = (width: number, height: number): CSSProperties => ({
  aspectRatio: `${width} / ${height}`,
  width: `min(calc(${LIGHTBOX_MAX_VW}vw - var(${LIGHTBOX_RESERVE_X_VAR}, 0px)), calc((${LIGHTBOX_MAX_SVH}svh - var(${LIGHTBOX_RESERVE_Y_VAR}, 0px)) * ${width / height}), ${width}px)`,
});

export const lightboxSizes = (width: number, height: number) =>
  `min(${LIGHTBOX_MAX_VW}vw, ${LIGHTBOX_MAX_SVH * (width / height)}vh, ${width}px)`;

export const toLightboxItem = (
  slot: MediaSlot & { src: string },
): LightboxItem => ({
  alt: slot.alt ?? slot.label,
  height: slot.height,
  src: slot.src,
  video: slot.video,
  width: slot.width,
});

export const toLightboxItems = (slots: readonly MediaSlot[]) =>
  slots.flatMap((slot) => (slot.src ? [toLightboxItem(slot)] : []));

export const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

export const swipeStep = (deltaX: number, deltaY: number): -1 | 0 | 1 => {
  const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

  if (!isHorizontal || Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
    return 0;
  }

  return deltaX < 0 ? 1 : -1;
};

export const mediaPosition = (index: number, total: number) =>
  `${index + 1} ${MEDIA_POSITION_SEPARATOR} ${total}`;
