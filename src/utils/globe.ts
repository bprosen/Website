import {
  GLOBE_MIN_VISIBLE_COSINE,
  GLOBE_RADIUS,
  GLOBE_VIEWBOX_SIZE,
} from '~/constants';
import type { LatLon } from '~/types';
import { clamp, RADIANS_PER_DEGREE } from './math';

export type PointTable = {
  cosLat: Float32Array;
  cosLon: Float32Array;
  count: number;
  sinLat: Float32Array;
  sinLon: Float32Array;
};

export const preparePoints = (flat: readonly number[]): PointTable => {
  const count = Math.floor(flat.length / 2);
  const table: PointTable = {
    cosLat: new Float32Array(count),
    cosLon: new Float32Array(count),
    count,
    sinLat: new Float32Array(count),
    sinLon: new Float32Array(count),
  };

  for (let i = 0; i < count; i++) {
    const lat = flat[i * 2] * RADIANS_PER_DEGREE;
    const lon = flat[i * 2 + 1] * RADIANS_PER_DEGREE;
    table.cosLat[i] = Math.cos(lat);
    table.sinLat[i] = Math.sin(lat);
    table.cosLon[i] = Math.cos(lon);
    table.sinLon[i] = Math.sin(lon);
  }

  return table;
};

export type View = {
  cosLat0: number;
  cosLon0: number;
  sinLat0: number;
  sinLon0: number;
};

export const createView = (lat: number, lon: number): View => ({
  cosLat0: Math.cos(lat * RADIANS_PER_DEGREE),
  cosLon0: Math.cos(lon * RADIANS_PER_DEGREE),
  sinLat0: Math.sin(lat * RADIANS_PER_DEGREE),
  sinLon0: Math.sin(lon * RADIANS_PER_DEGREE),
});

export type ProjectedPoint = {
  visible: boolean;
  x: number;
  y: number;
};

export const projectPoint = (
  [lat, lon]: LatLon,
  view: View,
  radius = GLOBE_RADIUS,
): ProjectedPoint => {
  const f = lat * RADIANS_PER_DEGREE;
  const dl = lon * RADIANS_PER_DEGREE;
  const cosF = Math.cos(f);
  const sinF = Math.sin(f);
  const cosL = Math.cos(dl);
  const sinL = Math.sin(dl);
  const cosD = cosL * view.cosLon0 + sinL * view.sinLon0;
  const sinD = sinL * view.cosLon0 - cosL * view.sinLon0;
  const c = view.sinLat0 * sinF + view.cosLat0 * cosF * cosD;

  return {
    visible: c > GLOBE_MIN_VISIBLE_COSINE,
    x: radius * cosF * sinD,
    y: -radius * (view.cosLat0 * sinF - view.sinLat0 * cosF * cosD),
  };
};

export const projectPoints = (
  table: PointTable,
  view: View,
  out: Float32Array,
  radius = GLOBE_RADIUS,
) => {
  const { cosLat0, cosLon0, sinLat0, sinLon0 } = view;
  let written = 0;

  for (let i = 0; i < table.count; i++) {
    const cosF = table.cosLat[i];
    const sinF = table.sinLat[i];
    const cosD = table.cosLon[i] * cosLon0 + table.sinLon[i] * sinLon0;

    if (sinLat0 * sinF + cosLat0 * cosF * cosD <= GLOBE_MIN_VISIBLE_COSINE) {
      continue;
    }

    const sinD = table.sinLon[i] * cosLon0 - table.cosLon[i] * sinLon0;
    out[written * 2] = radius * cosF * sinD;
    out[written * 2 + 1] = -radius * (cosLat0 * sinF - sinLat0 * cosF * cosD);
    written++;
  }

  return written;
};

export const toGlobeUnits = (
  clientX: number,
  clientY: number,
  rect: Pick<DOMRect, 'height' | 'left' | 'top' | 'width'>,
) => ({
  x:
    ((clientX - rect.left) / rect.width) * GLOBE_VIEWBOX_SIZE -
    GLOBE_VIEWBOX_SIZE / 2,
  y:
    ((clientY - rect.top) / rect.height) * GLOBE_VIEWBOX_SIZE -
    GLOBE_VIEWBOX_SIZE / 2,
});

export const clampTooltipCenter = (
  center: number,
  width: number,
  min: number,
  max: number,
) =>
  width >= max - min
    ? (min + max) / 2
    : clamp(center, min + width / 2, max - width / 2);
