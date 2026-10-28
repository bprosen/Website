import { describe, expect, it } from 'vitest';
import {
  clamp,
  clampTooltipCenter,
  createView,
  preparePoints,
  projectPoint,
  projectPoints,
  toGlobeUnits,
} from './globe';

describe('clamp', () => {
  it('keeps values inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe('projectPoint', () => {
  it('puts the view centre at the middle of the disc', () => {
    const point = projectPoint([20, 40], createView(20, 40), 90);

    expect(point.visible).toBe(true);
    expect(point.x).toBeCloseTo(0);
    expect(point.y).toBeCloseTo(0);
  });

  it('hides the antipode', () => {
    expect(projectPoint([-20, -140], createView(20, 40)).visible).toBe(false);
  });

  it('places points east of centre to the right and north above', () => {
    const view = createView(0, 0);

    expect(projectPoint([0, 30], view, 90).x).toBeCloseTo(45);
    expect(projectPoint([30, 0], view, 90).y).toBeCloseTo(-45);
  });

  it('hides points right on the limb', () => {
    expect(projectPoint([0, 89], createView(0, 0)).visible).toBe(false);
    expect(projectPoint([0, 88], createView(0, 0)).visible).toBe(true);
  });
});

describe('preparePoints / projectPoints', () => {
  const flat = [10, 20, -30, 100, 60, -150, 0, 0];

  it('precomputes trig for every pair', () => {
    const table = preparePoints(flat);

    expect(table.count).toBe(4);
    expect(table.cosLat[1]).toBeCloseTo(Math.cos((-30 * Math.PI) / 180));
    expect(table.sinLon[2]).toBeCloseTo(Math.sin((-150 * Math.PI) / 180));
  });

  it('ignores a trailing unpaired value', () => {
    expect(preparePoints([1, 2, 3]).count).toBe(1);
  });

  it('matches projectPoint and writes only visible points', () => {
    const table = preparePoints(flat);
    const view = createView(15, 30);
    const out = new Float32Array(table.count * 2);
    const written = projectPoints(table, view, out, 90);
    const expected = [];

    for (let i = 0; i < flat.length; i += 2) {
      const point = projectPoint([flat[i], flat[i + 1]], view, 90);

      if (point.visible) {
        expected.push(point);
      }
    }

    expect(written).toBe(expected.length);
    expected.forEach((point, i) => {
      expect(out[i * 2]).toBeCloseTo(point.x, 3);
      expect(out[i * 2 + 1]).toBeCloseTo(point.y, 3);
    });
  });
});

describe('toGlobeUnits', () => {
  const rect = { height: 200, left: 100, top: 50, width: 200 };

  it('maps the element centre to 0, 0 and corners to ±100', () => {
    expect(toGlobeUnits(200, 150, rect)).toEqual({ x: 0, y: 0 });
    expect(toGlobeUnits(100, 50, rect)).toEqual({ x: -100, y: -100 });
    expect(toGlobeUnits(300, 250, rect)).toEqual({ x: 100, y: 100 });
  });

  it('scales with the element size', () => {
    expect(
      toGlobeUnits(50, 50, { height: 100, left: 0, top: 0, width: 100 }),
    ).toEqual({ x: 0, y: 0 });
  });
});

describe('clampTooltipCenter', () => {
  it('follows the marker when the tooltip fits', () => {
    expect(clampTooltipCenter(150, 100, 0, 300)).toBe(150);
  });

  it('keeps the tooltip inside the bounds at either edge', () => {
    expect(clampTooltipCenter(10, 100, 0, 300)).toBe(50);
    expect(clampTooltipCenter(290, 100, 0, 300)).toBe(250);
  });

  it('allows bounds wider than the globe', () => {
    expect(clampTooltipCenter(100, 280, -200, 110)).toBe(-30);
  });

  it('centres a tooltip wider than the bounds', () => {
    expect(clampTooltipCenter(10, 400, 0, 300)).toBe(150);
  });
});
