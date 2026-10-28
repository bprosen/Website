import {
  GLOBE_DRAG_LAT_PER_PX,
  GLOBE_DRAG_LON_PER_PX,
  GLOBE_DRAG_THRESHOLD_PX,
  GLOBE_FLING_NEWEST_WEIGHT,
  GLOBE_FLING_WINDOW_MS,
  GLOBE_KEY_STEP_LAT,
  GLOBE_KEY_STEP_LON,
  GLOBE_LAT_DAMPING,
  GLOBE_LAT_LIMIT,
  GLOBE_LON_DAMPING,
  GLOBE_MAX_FLING_SPEED,
  GLOBE_MAX_STEP_SECONDS,
  GLOBE_MIN_DRAG_STEP_SECONDS,
  GLOBE_REST_SPEED,
} from '~/constants';
import { clamp } from './globe';

export type Motion = {
  lat: number;
  lon: number;
  vLat: number;
  vLon: number;
};

export type DragVelocity = {
  lat: number;
  lon: number;
};

const clampLat = (lat: number) => clamp(lat, -GLOBE_LAT_LIMIT, GLOBE_LAT_LIMIT);

export const stepIdle = (
  motion: Motion,
  dt: number,
  autoSpeed: number,
): Motion => {
  const step = clamp(dt, 0, GLOBE_MAX_STEP_SECONDS);
  const vLon =
    autoSpeed + (motion.vLon - autoSpeed) * Math.exp(-step * GLOBE_LON_DAMPING);
  const vLat = motion.vLat * Math.exp(-step * GLOBE_LAT_DAMPING);

  return {
    lat: clampLat(motion.lat + vLat * step),
    lon: motion.lon + vLon * step,
    vLat,
    vLon,
  };
};

export const isAtRest = (motion: Motion, autoSpeed: number) =>
  autoSpeed === 0 &&
  Math.abs(motion.vLon) < GLOBE_REST_SPEED &&
  Math.abs(motion.vLat) < GLOBE_REST_SPEED;

export const applyDrag = (
  motion: Motion,
  velocity: DragVelocity,
  dx: number,
  dy: number,
  dt: number,
): { motion: Motion; velocity: DragVelocity } => {
  const step = Math.max(GLOBE_MIN_DRAG_STEP_SECONDS, dt);
  const dLon = -dx * GLOBE_DRAG_LON_PER_PX;
  const dLat = dy * GLOBE_DRAG_LAT_PER_PX;
  const keep = 1 - GLOBE_FLING_NEWEST_WEIGHT;

  return {
    motion: {
      lat: clampLat(motion.lat + dLat),
      lon: motion.lon + dLon,
      vLat: 0,
      vLon: 0,
    },
    velocity: {
      lat: keep * velocity.lat + GLOBE_FLING_NEWEST_WEIGHT * (dLat / step),
      lon: keep * velocity.lon + GLOBE_FLING_NEWEST_WEIGHT * (dLon / step),
    },
  };
};

export const releaseVelocity = (
  velocity: DragVelocity,
  idleMs: number,
): Pick<Motion, 'vLat' | 'vLon'> => {
  if (idleMs >= GLOBE_FLING_WINDOW_MS) {
    return { vLat: 0, vLon: 0 };
  }

  return {
    vLat: clamp(velocity.lat, -GLOBE_MAX_FLING_SPEED, GLOBE_MAX_FLING_SPEED),
    vLon: clamp(velocity.lon, -GLOBE_MAX_FLING_SPEED, GLOBE_MAX_FLING_SPEED),
  };
};

const NUDGES: Readonly<Record<string, readonly [lon: number, lat: number]>> = {
  ArrowDown: [0, GLOBE_KEY_STEP_LAT],
  ArrowLeft: [GLOBE_KEY_STEP_LON, 0],
  ArrowRight: [-GLOBE_KEY_STEP_LON, 0],
  ArrowUp: [0, -GLOBE_KEY_STEP_LAT],
};

export const nudge = (motion: Motion, key: string): Motion | null => {
  const step = Object.hasOwn(NUDGES, key) ? NUDGES[key] : undefined;

  if (!step) {
    return null;
  }

  return {
    ...motion,
    lat: clampLat(motion.lat + step[1]),
    lon: motion.lon + step[0],
  };
};

export const exceedsDragThreshold = (
  startX: number,
  startY: number,
  x: number,
  y: number,
) => Math.hypot(x - startX, y - startY) >= GLOBE_DRAG_THRESHOLD_PX;

export type MarkerHit<Id extends string> = {
  id: Id;
  visible: boolean;
  x: number;
  y: number;
};

export const hitTestMarker = <Id extends string>(
  point: { x: number; y: number },
  markers: readonly MarkerHit<Id>[],
  radius: number,
): Id | null => {
  let best: Id | null = null;
  let bestDistance = radius;

  for (const marker of markers) {
    if (!marker.visible) {
      continue;
    }

    const distance = Math.hypot(point.x - marker.x, point.y - marker.y);

    if (distance <= bestDistance) {
      best = marker.id;
      bestDistance = distance;
    }
  }

  return best;
};
