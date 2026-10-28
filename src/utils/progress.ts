const clampUnit = (value: number) => Math.min(1, Math.max(0, value));

export const passedFraction = (top: number, height: number, line: number) =>
  height > 0 ? clampUnit((line - top) / height) : 0;

export const spansLine = (top: number, bottom: number, line: number) =>
  top < line && bottom > line;
