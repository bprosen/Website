import type { CSSProperties } from 'react';
import {
  LIGHTBOX_MAX_SVH,
  LIGHTBOX_MAX_VW,
  LIGHTBOX_RESERVE_X_PX,
  LIGHTBOX_RESERVE_X_VAR,
  LIGHTBOX_RESERVE_Y_PX,
  LIGHTBOX_RESERVE_Y_VAR,
  LIGHTBOX_SIDE_CONTROLS_QUERY,
  MEDIA_POSITION_SEPARATOR,
  SWIPE_THRESHOLD_PX,
} from '~/constants';
import type { LightboxItem, MediaSlot } from '~/types';

export const fitToScreen = (width: number, height: number): CSSProperties => ({
  aspectRatio: `${width} / ${height}`,
  width: `min(calc(${LIGHTBOX_MAX_VW}vw - var(${LIGHTBOX_RESERVE_X_VAR}, 0px)), calc((${LIGHTBOX_MAX_SVH}svh - var(${LIGHTBOX_RESERVE_Y_VAR}, 0px)) * ${width / height}), ${width}px)`,
});

const fitSize = (
  width: number,
  height: number,
  reserveX: number,
  reserveY: number,
) => {
  const ratio = width / height;

  return `min(calc(${LIGHTBOX_MAX_VW}vw - ${reserveX}px), calc(${LIGHTBOX_MAX_SVH * ratio}vh - ${reserveY * ratio}px), ${width}px)`;
};

export const lightboxSizes = (
  width: number,
  height: number,
  hasControls = false,
) =>
  hasControls
    ? `${LIGHTBOX_SIDE_CONTROLS_QUERY} ${fitSize(width, height, LIGHTBOX_RESERVE_X_PX, 0)}, ${fitSize(width, height, 0, LIGHTBOX_RESERVE_Y_PX)}`
    : fitSize(width, height, 0, 0);

export const toLightboxItem = (
  slot: MediaSlot & { src: string },
): LightboxItem => ({
  alt: slot.alt ?? slot.label,
  height: slot.height,
  src: slot.src,
  tint: slot.tint,
  video: slot.video,
  width: slot.width,
});

export const toLightboxItems = (slots: readonly MediaSlot[]) =>
  slots.flatMap((slot) => (slot.src ? [toLightboxItem(slot)] : []));

export const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

export const neighbourItems = <Item>(items: readonly Item[], index: number) => {
  const neighbourIndexes = new Set([
    wrapIndex(index - 1, items.length),
    wrapIndex(index + 1, items.length),
  ]);
  neighbourIndexes.delete(index);

  return [...neighbourIndexes].flatMap((neighbourIndex) => {
    const item = items[neighbourIndex];
    return item ? [item] : [];
  });
};

export const swipeStep = (deltaX: number, deltaY: number): -1 | 0 | 1 => {
  const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

  if (!isHorizontal || Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
    return 0;
  }

  return deltaX < 0 ? 1 : -1;
};

export const mediaPosition = (index: number, total: number) =>
  `${index + 1} ${MEDIA_POSITION_SEPARATOR} ${total}`;
