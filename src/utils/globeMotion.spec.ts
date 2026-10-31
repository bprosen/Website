import { describe, expect, it } from 'vitest';
import {
  GLOBE_AUTO_SPIN_DEG_PER_SECOND,
  GLOBE_DRAG_LAT_PER_PX,
  GLOBE_DRAG_LON_PER_PX,
  GLOBE_FLING_NEWEST_WEIGHT,
  GLOBE_FLING_WINDOW_MS,
  GLOBE_INITIAL_VIEW,
  GLOBE_INTRO_SPIN_DEG_PER_SECOND,
  GLOBE_KEY_STEP_LAT,
  GLOBE_KEY_STEP_LON,
  GLOBE_LAT_LIMIT,
  GLOBE_MAX_FLING_SPEED,
  GLOBE_MAX_STEP_SECONDS,
} from '~/constants';
import {
  applyDrag,
  centerOn,
  exceedsDragThreshold,
  hitTestMarker,
  introMotion,
  isAtRest,
  type Motion,
  moveDrag,
  nudge,
  releaseDrag,
  releaseVelocity,
  shortestLonDelta,
  startDrag,
  stepIdle,
  turnToward,
} from './globeMotion';

const still: Motion = { lat: 0, lon: 0, vLat: 0, vLon: 0 };

describe('stepIdle', () => {
  it('spins at the auto speed once settled', () => {
    const next = stepIdle(
      { ...still, vLon: GLOBE_AUTO_SPIN_DEG_PER_SECOND },
      0.1,
      GLOBE_AUTO_SPIN_DEG_PER_SECOND,
    );

    expect(next.vLon).toBeCloseTo(GLOBE_AUTO_SPIN_DEG_PER_SECOND);
    expect(next.lon).toBeCloseTo(GLOBE_AUTO_SPIN_DEG_PER_SECOND * 0.1);
  });

  it('eases a fast fling back toward the auto speed', () => {
    let motion: Motion = { ...still, vLon: 400 };

    for (let i = 0; i < 600; i++) {
      motion = stepIdle(motion, 1 / 60, GLOBE_AUTO_SPIN_DEG_PER_SECOND);
    }

    expect(motion.vLon).toBeLessThan(GLOBE_AUTO_SPIN_DEG_PER_SECOND + 0.5);
    expect(motion.vLon).toBeGreaterThan(GLOBE_AUTO_SPIN_DEG_PER_SECOND);
  });

  it('decays to rest with no auto-spin (reduced motion)', () => {
    let motion: Motion = { ...still, vLat: 50, vLon: 200 };

    for (let i = 0; i < 1200; i++) {
      motion = stepIdle(motion, 1 / 60, 0);
    }

    expect(isAtRest(motion, 0)).toBe(true);
  });

  it('caps a long frame gap so the globe never jumps', () => {
    const next = stepIdle({ ...still, vLon: 10 }, 5, 10);

    expect(next.lon).toBeCloseTo(10 * GLOBE_MAX_STEP_SECONDS);
  });

  it('ignores negative time steps', () => {
    expect(stepIdle({ ...still, vLon: 10 }, -1, 10).lon).toBe(0);
  });

  it('clamps latitude', () => {
    const next = stepIdle({ ...still, lat: 69, vLat: 100 }, 0.1, 0);

    expect(next.lat).toBe(GLOBE_LAT_LIMIT);
  });
});

describe('isAtRest', () => {
  it('is never at rest while auto-spinning', () => {
    expect(isAtRest(still, GLOBE_AUTO_SPIN_DEG_PER_SECOND)).toBe(false);
  });

  it('is at rest only when both velocities are negligible', () => {
    expect(isAtRest(still, 0)).toBe(true);
    expect(isAtRest({ ...still, vLon: 0.5 }, 0)).toBe(false);
    expect(isAtRest({ ...still, vLat: -0.5 }, 0)).toBe(false);
  });
});

describe('applyDrag', () => {
  it('rotates opposite to horizontal drag and with vertical drag', () => {
    const { motion } = applyDrag(still, { lat: 0, lon: 0 }, 10, 5, 0.016);

    expect(motion.lon).toBeCloseTo(-10 * GLOBE_DRAG_LON_PER_PX);
    expect(motion.lat).toBeCloseTo(5 * GLOBE_DRAG_LAT_PER_PX);
    expect(motion.vLon).toBe(0);
    expect(motion.vLat).toBe(0);
  });

  it('smooths the fling velocity', () => {
    const { velocity } = applyDrag(still, { lat: 0, lon: 100 }, -10, 0, 0.1);

    expect(velocity.lon).toBeCloseTo(86);
  });

  it('tracks a vertical fling separately from a horizontal one', () => {
    const { velocity } = applyDrag(still, { lat: 0, lon: 0 }, 0, 10, 0.1);

    expect(velocity.lat).toBeCloseTo(
      GLOBE_FLING_NEWEST_WEIGHT * ((10 * GLOBE_DRAG_LAT_PER_PX) / 0.1),
    );
    expect(velocity.lon).toBe(0);
  });

  it('guards against a zero time step', () => {
    const { velocity } = applyDrag(still, { lat: 0, lon: 0 }, -1, 0, 0);

    expect(Number.isFinite(velocity.lon)).toBe(true);
    expect(velocity.lon).toBeCloseTo((0.35 * GLOBE_DRAG_LON_PER_PX) / 0.008);
  });

  it('clamps latitude', () => {
    const { motion } = applyDrag(
      { ...still, lat: -69 },
      { lat: 0, lon: 0 },
      0,
      -100,
      0.016,
    );

    expect(motion.lat).toBe(-GLOBE_LAT_LIMIT);
  });
});

describe('releaseVelocity', () => {
  it('flings with the drag velocity on a quick release', () => {
    expect(releaseVelocity({ lat: 12, lon: -40 }, 10)).toEqual({
      vLat: 12,
      vLon: -40,
    });
  });

  it('limits the fling speed', () => {
    expect(releaseVelocity({ lat: -9000, lon: 9000 }, 0)).toEqual({
      vLat: -GLOBE_MAX_FLING_SPEED,
      vLon: GLOBE_MAX_FLING_SPEED,
    });
  });

  it('stops when the pointer rested before letting go', () => {
    expect(
      releaseVelocity({ lat: 12, lon: 40 }, GLOBE_FLING_WINDOW_MS),
    ).toEqual({ vLat: 0, vLon: 0 });
  });
});

describe('nudge', () => {
  it('rotates for each arrow key', () => {
    expect(nudge(still, 'ArrowLeft')?.lon).toBe(GLOBE_KEY_STEP_LON);
    expect(nudge(still, 'ArrowRight')?.lon).toBe(-GLOBE_KEY_STEP_LON);
    expect(nudge(still, 'ArrowUp')?.lat).toBe(-GLOBE_KEY_STEP_LAT);
    expect(nudge(still, 'ArrowDown')?.lat).toBe(GLOBE_KEY_STEP_LAT);
  });

  it('keeps velocity and clamps latitude', () => {
    expect(nudge({ ...still, lat: 68, vLon: 9 }, 'ArrowDown')).toEqual({
      lat: GLOBE_LAT_LIMIT,
      lon: 0,
      vLat: 0,
      vLon: 9,
    });
  });

  it('ignores other keys, including inherited names', () => {
    expect(nudge(still, 'Enter')).toBeNull();
    expect(nudge(still, 'constructor')).toBeNull();
  });
});

describe('exceedsDragThreshold', () => {
  it('starts dragging at 4px of travel', () => {
    expect(exceedsDragThreshold(0, 0, 3, 0)).toBe(false);
    expect(exceedsDragThreshold(0, 0, 3.9, 0)).toBe(false);
    expect(exceedsDragThreshold(0, 0, 4, 0)).toBe(true);
    expect(exceedsDragThreshold(10, 10, 13, 14)).toBe(true);
  });
});

describe('hitTestMarker', () => {
  const markers = [
    { id: 'home' as const, visible: true, x: 0, y: 0 },
    { id: 'visitor' as const, visible: true, x: 20, y: 0 },
  ];

  it('hits a marker within the radius', () => {
    expect(hitTestMarker({ x: -12.9, y: 0 }, markers, 13)).toBe('home');
    expect(hitTestMarker({ x: 0, y: 13 }, markers, 13)).toBe('home');
  });

  it('misses outside the radius', () => {
    expect(hitTestMarker({ x: 0, y: 13.1 }, markers, 13)).toBeNull();
  });

  it('picks the closest of overlapping markers', () => {
    expect(hitTestMarker({ x: 11, y: 0 }, markers, 13)).toBe('visitor');
  });

  it("can't hit markers on the far side", () => {
    expect(
      hitTestMarker({ x: 0, y: 0 }, [{ ...markers[0], visible: false }], 13),
    ).toBeNull();
  });
});

describe('introMotion', () => {
  it('starts still at the resting view under reduced motion', () => {
    expect(introMotion(true)).toEqual({
      ...GLOBE_INITIAL_VIEW,
      vLat: 0,
      vLon: 0,
    });
  });

  it('spins up fast and settles facing the resting view', () => {
    let motion = introMotion(false);

    expect(motion.vLon).toBe(GLOBE_INTRO_SPIN_DEG_PER_SECOND);

    const seconds = 12;
    for (let i = 0; i < seconds * 60; i++) {
      motion = stepIdle(motion, 1 / 60, GLOBE_AUTO_SPIN_DEG_PER_SECOND);
    }

    const drift = GLOBE_AUTO_SPIN_DEG_PER_SECOND * seconds;
    expect(Math.abs(motion.lon - drift - GLOBE_INITIAL_VIEW.lon)).toBeLessThan(
      5,
    );
    expect(motion.vLon).toBeCloseTo(GLOBE_AUTO_SPIN_DEG_PER_SECOND, 1);
  });
});

describe('shortestLonDelta', () => {
  it('turns the short way around the globe', () => {
    expect(shortestLonDelta(0, 90)).toBe(90);
    expect(shortestLonDelta(170, -170)).toBe(20);
    expect(shortestLonDelta(-170, 170)).toBe(-20);
    expect(shortestLonDelta(720 + 10, 0)).toBe(-10);
  });
});

describe('turnToward', () => {
  it('eases toward the target longitude and stops any spin', () => {
    const turned = turnToward({ ...still, lon: 0, vLon: 9 }, 100, 0.1);

    expect(turned.lon).toBeGreaterThan(0);
    expect(turned.lon).toBeLessThan(100);
    expect(turned.vLon).toBe(0);
  });

  it('ignores long frame gaps', () => {
    expect(turnToward({ ...still, lon: 0 }, 100, 60).lon).toBeCloseTo(
      turnToward({ ...still, lon: 0 }, 100, GLOBE_MAX_STEP_SECONDS).lon,
    );
  });
});

describe('centerOn', () => {
  it('jumps straight to the target longitude', () => {
    expect(centerOn({ ...still, lon: 350 }, -5).lon).toBe(355);
  });
});

describe('startDrag', () => {
  it('remembers where the press started and has not moved yet', () => {
    expect(startDrag(7, 10, 20, 1000)).toEqual({
      dragging: false,
      lastMoveMs: 1000,
      lastX: 10,
      lastY: 20,
      pointerId: 7,
      startX: 10,
      startY: 20,
      velocity: { lat: 0, lon: 0 },
    });
  });
});

describe('moveDrag', () => {
  it('rotates by the movement since the last event and starts dragging', () => {
    const { drag, motion } = moveDrag(startDrag(1, 0, 0, 0), still, 10, 0, 100);

    expect(motion.lon).toBeCloseTo(-10 * GLOBE_DRAG_LON_PER_PX);
    expect(drag).toMatchObject({
      dragging: true,
      lastMoveMs: 100,
      lastX: 10,
      lastY: 0,
      startX: 0,
    });
    expect(drag.velocity.lon).toBeLessThan(0);
  });
});

describe('releaseDrag', () => {
  it('flings with the drag velocity on a quick release', () => {
    const drag = { ...startDrag(1, 0, 0, 0), velocity: { lat: 12, lon: -40 } };

    expect(releaseDrag(drag, still, 10)).toMatchObject({ vLat: 12, vLon: -40 });
  });

  it('stops dead after a slow release', () => {
    const drag = { ...startDrag(1, 0, 0, 0), velocity: { lat: 12, lon: -40 } };

    expect(releaseDrag(drag, still, 10_000)).toMatchObject({
      vLat: 0,
      vLon: 0,
    });
  });
});
