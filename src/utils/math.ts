export const RADIANS_PER_DEGREE = Math.PI / 180;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
