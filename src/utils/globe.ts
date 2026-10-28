import {
  GLOBE_EXTENT,
  GLOBE_MIN_VISIBLE_COSINE,
  GLOBE_RADIUS,
} from '~/constants';
import type { LatLon } from '~/types';

const RAD = Math.PI / 180;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

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
    const lat = flat[i * 2] * RAD;
    const lon = flat[i * 2 + 1] * RAD;
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
  cosLat0: Math.cos(lat * RAD),
  cosLon0: Math.cos(lon * RAD),
  sinLat0: Math.sin(lat * RAD),
  sinLon0: Math.sin(lon * RAD),
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
  const f = lat * RAD;
  const dl = lon * RAD;
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
  x: ((clientX - rect.left) / rect.width) * GLOBE_EXTENT - GLOBE_EXTENT / 2,
  y: ((clientY - rect.top) / rect.height) * GLOBE_EXTENT - GLOBE_EXTENT / 2,
});

export const clampTooltipCenter = (
  center: number,
  width: number,
  containerSize: number,
) =>
  width >= containerSize
    ? containerSize / 2
    : clamp(center, width / 2, containerSize - width / 2);
