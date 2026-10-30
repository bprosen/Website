import { clamp } from './math';

export const passedFraction = (top: number, height: number, line: number) =>
  height > 0 ? clamp((line - top) / height, 0, 1) : 0;

export const spansLine = (top: number, bottom: number, line: number) =>
  top < line && bottom > line;
