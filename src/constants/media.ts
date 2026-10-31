export const LIGHTBOX_MAX_VW = 92;
export const LIGHTBOX_MAX_SVH = 85;
export const LIGHTBOX_RESERVE_X_VAR = '--lightbox-reserve-x';
export const LIGHTBOX_RESERVE_Y_VAR = '--lightbox-reserve-y';
export const LIGHTBOX_RESERVE_X_PX = 136;
export const LIGHTBOX_RESERVE_Y_PX = 112;
export const LIGHTBOX_SIDE_CONTROLS_QUERY = '(min-width: 640px)';
export const LIGHTBOX_GALLERY_RESERVE_CLASS =
  '[--lightbox-reserve-y:112px] sm:[--lightbox-reserve-x:136px] sm:[--lightbox-reserve-y:0px]';
export const SWIPE_THRESHOLD_PX = 50;
export const ARROW_KEY_STEPS: Readonly<Record<string, -1 | 1>> = {
  ArrowLeft: -1,
  ArrowRight: 1,
};
