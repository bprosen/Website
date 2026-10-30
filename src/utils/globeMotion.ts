import {
  GLOBE_AUTO_SPIN_DEG_PER_SECOND,
  GLOBE_DRAG_LAT_PER_PX,
  GLOBE_DRAG_LON_PER_PX,
  GLOBE_DRAG_THRESHOLD_PX,
  GLOBE_FLING_NEWEST_WEIGHT,
  GLOBE_FLING_WINDOW_MS,
  GLOBE_INITIAL_VIEW,
  GLOBE_INTRO_SPIN_DEG_PER_SECOND,
  GLOBE_KEY_STEP_LAT,
  GLOBE_KEY_STEP_LON,
  GLOBE_LAT_DAMPING,
  GLOBE_LAT_LIMIT,
  GLOBE_LON_DAMPING,
  GLOBE_MAX_FLING_SPEED,
  GLOBE_MAX_STEP_SECONDS,
  GLOBE_MIN_DRAG_STEP_SECONDS,
  GLOBE_REST_SPEED,
  GLOBE_SEEK_RATE_PER_SECOND,
  MS_PER_SECOND,
} from '~/constants';
import { clamp } from './math';

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

export const shortestLonDelta = (from: number, to: number) =>
  ((((to - from) % 360) + 540) % 360) - 180;

export const turnToward = (
  motion: Motion,
  targetLon: number,
  elapsedSeconds: number,
): Motion => {
  const step = clamp(elapsedSeconds, 0, GLOBE_MAX_STEP_SECONDS);
  const turned =
    shortestLonDelta(motion.lon, targetLon) *
    (1 - Math.exp(-step * GLOBE_SEEK_RATE_PER_SECOND));

  return { ...motion, lon: motion.lon + turned, vLat: 0, vLon: 0 };
};

export const centerOn = (motion: Motion, targetLon: number): Motion => ({
  ...motion,
  lon: motion.lon + shortestLonDelta(motion.lon, targetLon),
  vLat: 0,
  vLon: 0,
});

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

export const introMotion = (reducedMotion: boolean): Motion => {
  if (reducedMotion) {
    return { ...GLOBE_INITIAL_VIEW, vLat: 0, vLon: 0 };
  }

  const settleDistance =
    (GLOBE_INTRO_SPIN_DEG_PER_SECOND - GLOBE_AUTO_SPIN_DEG_PER_SECOND) /
    GLOBE_LON_DAMPING;

  return {
    lat: GLOBE_INITIAL_VIEW.lat,
    lon: GLOBE_INITIAL_VIEW.lon - settleDistance,
    vLat: 0,
    vLon: GLOBE_INTRO_SPIN_DEG_PER_SECOND,
  };
};

export type DragState = {
  dragging: boolean;
  lastMoveMs: number;
  lastX: number;
  lastY: number;
  pointerId: number;
  startX: number;
  startY: number;
  velocity: DragVelocity;
};

export const startDrag = (
  pointerId: number,
  x: number,
  y: number,
  nowMs: number,
): DragState => ({
  dragging: false,
  lastMoveMs: nowMs,
  lastX: x,
  lastY: y,
  pointerId,
  startX: x,
  startY: y,
  velocity: { lat: 0, lon: 0 },
});

export const moveDrag = (
  drag: DragState,
  motion: Motion,
  x: number,
  y: number,
  nowMs: number,
): { drag: DragState; motion: Motion } => {
  const next = applyDrag(
    motion,
    drag.velocity,
    x - drag.lastX,
    y - drag.lastY,
    (nowMs - drag.lastMoveMs) / MS_PER_SECOND,
  );

  return {
    drag: {
      ...drag,
      dragging: true,
      lastMoveMs: nowMs,
      lastX: x,
      lastY: y,
      velocity: next.velocity,
    },
    motion: next.motion,
  };
};

export const releaseDrag = (
  drag: DragState,
  motion: Motion,
  nowMs: number,
): Motion => ({
  ...motion,
  ...releaseVelocity(drag.velocity, nowMs - drag.lastMoveMs),
});
