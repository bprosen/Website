'use client';

import { type RefObject, useEffect, useRef } from 'react';
import {
  COLORS,
  GLOBE_AUTO_SPIN_DEG_PER_SECOND,
  GLOBE_EXTENT,
  GLOBE_HIT_RADIUS,
  GLOBE_LAND_DOT_RADIUS,
  GLOBE_MAX_DPR,
  GLOBE_TOOLTIP_VIEWPORT_MARGIN,
  GLOBE_VISITOR_DOT_ALPHA,
  GLOBE_VISITOR_DOT_RADIUS,
  HOME_COORDS,
  LAND,
  REDUCED_MOTION_QUERY,
} from '~/constants';
import type { LatLon } from '~/types';
import {
  applyDrag,
  clampTooltipCenter,
  createView,
  type DragVelocity,
  exceedsDragThreshold,
  hitTestMarker,
  introMotion,
  isAtRest,
  type MarkerHit,
  type MarkerId,
  type Motion,
  nudge,
  type PointTable,
  preparePoints,
  projectPoint,
  projectPoints,
  releaseVelocity,
  stepIdle,
  toGlobeUnits,
  type View,
} from '~/utils';

const TAU = Math.PI * 2;

type DotLayer = {
  out: Float32Array;
  table: PointTable;
};

let landLayer: DotLayer | undefined;

const getLandLayer = (): DotLayer => {
  if (!landLayer) {
    const table = preparePoints(LAND);
    landLayer = { out: new Float32Array(table.count * 2), table };
  }

  return landLayer;
};

const toDotLayer = (dots: readonly LatLon[]): DotLayer => {
  const table = preparePoints(dots.flat());
  return { out: new Float32Array(table.count * 2), table };
};

type DragState = {
  captured: boolean;
  id: number;
  startX: number;
  startY: number;
  t: number;
  velocity: DragVelocity;
  x: number;
  y: number;
};

type Controls = {
  draw: () => void;
  measureTooltipBounds: () => void;
  wake: () => void;
};

export type UseGlobeMotionOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLElement | null>;
  dots: readonly LatLon[];
  meRef: RefObject<HTMLElement | null>;
  onSelect: (marker: MarkerId | null) => void;
  tip: MarkerId | null;
  tooltipRef: RefObject<HTMLElement | null>;
  visitorCoords: LatLon | null;
  youRef: RefObject<HTMLElement | null>;
};

const fillDots = (
  ctx: CanvasRenderingContext2D,
  out: Float32Array,
  count: number,
  radius: number,
) => {
  ctx.beginPath();

  for (let i = 0; i < count; i++) {
    const x = out[i * 2];
    const y = out[i * 2 + 1];
    ctx.moveTo(x + radius, y);
    ctx.arc(x, y, radius, 0, TAU);
  }

  ctx.fill();
};

const toPixels = (value: number, size: number) =>
  Math.round(((value + GLOBE_EXTENT / 2) / GLOBE_EXTENT) * size * 10) / 10;

const tryCapturePointer = (element: Element, pointerId: number) => {
  try {
    element.setPointerCapture(pointerId);
    return true;
  } catch {
    return false;
  }
};

const setHidden = (el: HTMLElement, hidden: boolean) => {
  if (el.hasAttribute('data-hidden') !== hidden) {
    el.toggleAttribute('data-hidden', hidden);
  }
};

type TooltipBounds = {
  max: number;
  min: number;
  width: number;
};

const place = (
  el: HTMLElement | null,
  hit: MarkerHit<MarkerId> | undefined,
  size: number,
  tooltip?: TooltipBounds,
) => {
  if (!el) {
    return;
  }

  if (!hit?.visible) {
    setHidden(el, true);
    return;
  }

  const x = toPixels(hit.x, size);
  const px = tooltip
    ? clampTooltipCenter(x, tooltip.width, tooltip.min, tooltip.max) -
      tooltip.width / 2
    : x;
  const transform = `translate3d(${px}px, ${toPixels(hit.y, size)}px, 0)`;

  if (el.style.transform !== transform) {
    el.style.transform = transform;
  }

  setHidden(el, false);
};

export const useGlobeMotion = ({
  canvasRef,
  containerRef,
  dots,
  meRef,
  onSelect,
  tip,
  tooltipRef,
  visitorCoords,
  youRef,
}: UseGlobeMotionOptions) => {
  const controls = useRef<Controls | null>(null);
  const tipRef = useRef(tip);
  const onSelectRef = useRef(onSelect);
  const visitorRef = useRef(visitorCoords);
  const dotsRef = useRef<DotLayer | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    const land = getLandLayer();
    const readColor = (name: string, fallback: string) =>
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || fallback;
    let ink = readColor('--ink', COLORS.ink);
    let coral = readColor('--coral', COLORS.coral);
    const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    let reduced = reducedQuery.matches;
    let motion: Motion = introMotion(reduced);
    let visible = false;
    let running = false;
    let frame = 0;
    let last = 0;
    let size = 0;
    const tooltipBounds: TooltipBounds = { max: 0, min: 0, width: 0 };
    let drag: DragState | null = null;
    const markers: MarkerHit<MarkerId>[] = [
      { id: 'me', visible: false, x: 0, y: 0 },
      { id: 'you', visible: false, x: 0, y: 0 },
    ];

    const autoSpeed = () =>
      reduced || tipRef.current !== null ? 0 : GLOBE_AUTO_SPIN_DEG_PER_SECOND;

    const drawDots = (view: View) => {
      if (!ctx || size === 0) {
        return;
      }

      const scale = canvas.width / GLOBE_EXTENT;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, canvas.width / 2, canvas.height / 2);

      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
      fillDots(
        ctx,
        land.out,
        projectPoints(land.table, view, land.out),
        GLOBE_LAND_DOT_RADIUS,
      );

      const visitors = dotsRef.current;

      if (visitors && visitors.table.count > 0) {
        ctx.globalAlpha = GLOBE_VISITOR_DOT_ALPHA;
        ctx.fillStyle = coral;
        fillDots(
          ctx,
          visitors.out,
          projectPoints(visitors.table, view, visitors.out),
          GLOBE_VISITOR_DOT_RADIUS,
        );
      }
    };

    const drawMarkers = (view: View) => {
      const [me, you] = markers;
      const visitor = visitorRef.current;

      Object.assign(me, projectPoint(HOME_COORDS, view));

      if (visitor) {
        Object.assign(you, projectPoint(visitor, view));
      } else {
        you.visible = false;
      }

      place(meRef.current, me, size);
      place(youRef.current, you, size);
      place(
        tooltipRef.current,
        markers.find(({ id }) => id === tipRef.current),
        size,
        tooltipBounds,
      );
    };

    const measureTooltipBounds = () => {
      const { left } = container.getBoundingClientRect();
      const viewport = document.documentElement.clientWidth;
      tooltipBounds.min = GLOBE_TOOLTIP_VIEWPORT_MARGIN - left;
      tooltipBounds.max = viewport - GLOBE_TOOLTIP_VIEWPORT_MARGIN - left;
    };

    const draw = () => {
      const view = createView(motion.lat, motion.lon);
      drawDots(view);
      drawMarkers(view);
    };

    const tick = (time: number) => {
      const dt = (time - last) / 1000;
      last = time;

      if (!drag?.captured) {
        motion = stepIdle(motion, dt, autoSpeed());
      }

      draw();

      if (!drag && isAtRest(motion, autoSpeed())) {
        running = false;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running || !visible) {
        return;
      }

      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const sleep = () => {
      cancelAnimationFrame(frame);
      running = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      drag = {
        captured: false,
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        t: performance.now(),
        velocity: { lat: 0, lon: 0 },
        x: event.clientX,
        y: event.clientY,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) {
        return;
      }

      if (!drag.captured) {
        if (
          !exceedsDragThreshold(
            drag.startX,
            drag.startY,
            event.clientX,
            event.clientY,
          )
        ) {
          return;
        }

        drag.captured = true;
        onSelectRef.current(null);

        tryCapturePointer(container, event.pointerId);

        wake();
      }

      const now = performance.now();
      const next = applyDrag(
        motion,
        drag.velocity,
        event.clientX - drag.x,
        event.clientY - drag.y,
        (now - drag.t) / 1000,
      );

      motion = next.motion;
      drag.velocity = next.velocity;
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.t = now;
    };

    const endDrag = (event: PointerEvent, isTap: boolean) => {
      if (!drag || event.pointerId !== drag.id) {
        return;
      }

      if (drag.captured) {
        motion = {
          ...motion,
          ...releaseVelocity(drag.velocity, performance.now() - drag.t),
        };
      } else if (isTap) {
        const point = toGlobeUnits(
          event.clientX,
          event.clientY,
          container.getBoundingClientRect(),
        );
        onSelectRef.current(hitTestMarker(point, markers, GLOBE_HIT_RADIUS));
      }

      drag = null;
      wake();
    };

    const onPointerUp = (event: PointerEvent) => endDrag(event, true);
    const onPointerCancel = (event: PointerEvent) => endDrag(event, false);

    const onKeyDown = (event: KeyboardEvent) => {
      const next = nudge(motion, event.key);

      if (!next) {
        return;
      }

      event.preventDefault();
      motion = next;
      draw();
    };

    const onReducedChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      wake();
    };

    const resizeObserver = new ResizeObserver(([entry]) => {
      size = entry.contentRect.width;
      const dpr = Math.min(window.devicePixelRatio || 1, GLOBE_MAX_DPR);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      measureTooltipBounds();
      draw();
    });

    const onWindowResize = () => {
      measureTooltipBounds();
      drawMarkers(createView(motion.lat, motion.lon));
    };

    const tooltipObserver = new ResizeObserver(([entry]) => {
      tooltipBounds.width = entry.contentRect.width;
      drawMarkers(createView(motion.lat, motion.lon));
    });

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      container.toggleAttribute('data-paused', !visible);

      if (visible) {
        wake();
      } else {
        sleep();
      }
    });

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerCancel);
    container.addEventListener('lostpointercapture', onPointerCancel);
    container.addEventListener('keydown', onKeyDown);
    reducedQuery.addEventListener('change', onReducedChange);
    resizeObserver.observe(container);

    if (tooltipRef.current) {
      tooltipObserver.observe(tooltipRef.current);
    }
    intersectionObserver.observe(container);
    const themeObserver = new MutationObserver(() => {
      ink = readColor('--ink', COLORS.ink);
      coral = readColor('--coral', COLORS.coral);
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributeFilter: ['class'],
      attributes: true,
    });
    window.addEventListener('resize', onWindowResize);
    controls.current = { draw, measureTooltipBounds, wake };

    return () => {
      sleep();
      controls.current = null;
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerCancel);
      container.removeEventListener('lostpointercapture', onPointerCancel);
      container.removeEventListener('keydown', onKeyDown);
      reducedQuery.removeEventListener('change', onReducedChange);
      window.removeEventListener('resize', onWindowResize);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      tooltipObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [canvasRef, containerRef, meRef, tooltipRef, youRef]);

  useEffect(() => {
    tipRef.current = tip;

    if (tip) {
      controls.current?.measureTooltipBounds();
    }

    controls.current?.draw();
    controls.current?.wake();
  }, [tip]);

  useEffect(() => {
    visitorRef.current = visitorCoords;
    controls.current?.draw();
  }, [visitorCoords]);

  useEffect(() => {
    dotsRef.current = dots.length > 0 ? toDotLayer(dots) : null;
    controls.current?.draw();
  }, [dots]);
};
