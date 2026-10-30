import { type RefObject, useEffect, useRef } from 'react';
import {
  COLORS,
  GLOBE_AUTO_SPIN_DEG_PER_SECOND,
  GLOBE_HIT_RADIUS,
  GLOBE_LAND_DOT_RADIUS,
  GLOBE_MAX_DPR,
  GLOBE_TOOLTIP_VIEWPORT_MARGIN,
  GLOBE_VIEWBOX_SIZE,
  GLOBE_VISITOR_DOT_ALPHA,
  GLOBE_VISITOR_DOT_RADIUS,
  HOME_COORDS,
  LAND,
  MOTION_PAUSED_ATTRIBUTE,
  MS_PER_SECOND,
  REDUCED_MOTION_QUERY,
} from '~/constants';
import type { LatLon, MarkerId } from '~/types';
import {
  centerOn,
  clampTooltipCenter,
  createView,
  type DragState,
  exceedsDragThreshold,
  hitTestMarker,
  introMotion,
  isAtRest,
  type MarkerHit,
  type Motion,
  moveDrag,
  nudge,
  type PointTable,
  preparePoints,
  projectPoint,
  projectPoints,
  releaseDrag,
  startDrag,
  stepIdle,
  toGlobeUnits,
  turnToward,
  type View,
} from '~/utils';

const TAU = Math.PI * 2;

type DotLayer = {
  projected: Float32Array;
  table: PointTable;
};

let landLayer: DotLayer | undefined;

const getLandLayer = (): DotLayer => {
  if (!landLayer) {
    const table = preparePoints(LAND);
    landLayer = { projected: new Float32Array(table.count * 2), table };
  }

  return landLayer;
};

const toDotLayer = (points: readonly LatLon[]): DotLayer => {
  const table = preparePoints(points.flat());
  return { projected: new Float32Array(table.count * 2), table };
};

type Controls = {
  draw: () => void;
  measureTooltipBounds: () => void;
  wake: () => void;
};

type UseGlobeMotionOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLElement | null>;
  homeMarkerRef: RefObject<HTMLElement | null>;
  onSelect: (marker: MarkerId | null) => void;
  selectedMarker: MarkerId | null;
  tooltipRef: RefObject<HTMLElement | null>;
  visitorCoords: LatLon | null;
  visitorDots: readonly LatLon[];
  visitorMarkerRef: RefObject<HTMLElement | null>;
};

const fillDots = (
  ctx: CanvasRenderingContext2D,
  projected: Float32Array,
  count: number,
  radius: number,
) => {
  ctx.beginPath();

  for (let i = 0; i < count; i++) {
    const x = projected[i * 2];
    const y = projected[i * 2 + 1];
    ctx.moveTo(x + radius, y);
    ctx.arc(x, y, radius, 0, TAU);
  }

  ctx.fill();
};

const toPixels = (value: number, size: number) =>
  Math.round(
    ((value + GLOBE_VIEWBOX_SIZE / 2) / GLOBE_VIEWBOX_SIZE) * size * 10,
  ) / 10;

const tryCapturePointer = (element: Element, pointerId: number) => {
  try {
    element.setPointerCapture(pointerId);
    return true;
  } catch {
    return false;
  }
};

const setHidden = (element: HTMLElement, hidden: boolean) => {
  if (element.hasAttribute('data-hidden') !== hidden) {
    element.toggleAttribute('data-hidden', hidden);
  }
};

type TooltipBounds = {
  max: number;
  min: number;
  width: number;
};

const place = (
  element: HTMLElement | null,
  hit: MarkerHit<MarkerId> | undefined,
  size: number,
  tooltip?: TooltipBounds,
) => {
  if (!element) {
    return;
  }

  if (!hit?.visible) {
    setHidden(element, true);
    return;
  }

  const x = toPixels(hit.x, size);
  const left = tooltip
    ? clampTooltipCenter(x, tooltip.width, tooltip.min, tooltip.max) -
      tooltip.width / 2
    : x;
  const transform = `translate3d(${left}px, ${toPixels(hit.y, size)}px, 0)`;

  if (element.style.transform !== transform) {
    element.style.transform = transform;
  }

  setHidden(element, false);
};

export const useGlobeMotion = ({
  canvasRef,
  containerRef,
  homeMarkerRef,
  onSelect,
  selectedMarker,
  tooltipRef,
  visitorCoords,
  visitorDots,
  visitorMarkerRef,
}: UseGlobeMotionOptions) => {
  const controlsRef = useRef<Controls | null>(null);
  const selectedMarkerRef = useRef(selectedMarker);
  const onSelectRef = useRef(onSelect);
  const visitorCoordsRef = useRef(visitorCoords);
  const visitorDotLayerRef = useRef<DotLayer | null>(null);

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
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    let prefersReducedMotion = reducedMotionQuery.matches;
    let motion: Motion = introMotion(prefersReducedMotion);
    let visible = false;
    let running = false;
    let frame = 0;
    let lastFrameMs = 0;
    let size = 0;
    const tooltipBounds: TooltipBounds = { max: 0, min: 0, width: 0 };
    let drag: DragState | null = null;
    const markers: MarkerHit<MarkerId>[] = [
      { id: 'home', visible: false, x: 0, y: 0 },
      { id: 'visitor', visible: false, x: 0, y: 0 },
    ];

    const motionPaused = () =>
      document.documentElement.hasAttribute(MOTION_PAUSED_ATTRIBUTE);
    const autoSpinDegPerSecond = () =>
      prefersReducedMotion ||
      motionPaused() ||
      selectedMarkerRef.current !== null
        ? 0
        : GLOBE_AUTO_SPIN_DEG_PER_SECOND;

    const drawDots = (view: View) => {
      if (!ctx || size === 0) {
        return;
      }

      const scale = canvas.width / GLOBE_VIEWBOX_SIZE;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, canvas.width / 2, canvas.height / 2);

      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
      fillDots(
        ctx,
        land.projected,
        projectPoints(land.table, view, land.projected),
        GLOBE_LAND_DOT_RADIUS,
      );

      const visitors = visitorDotLayerRef.current;

      if (visitors && visitors.table.count > 0) {
        ctx.globalAlpha = GLOBE_VISITOR_DOT_ALPHA;
        ctx.fillStyle = coral;
        fillDots(
          ctx,
          visitors.projected,
          projectPoints(visitors.table, view, visitors.projected),
          GLOBE_VISITOR_DOT_RADIUS,
        );
      }
    };

    const drawMarkers = (view: View) => {
      const [homeHit, visitorHit] = markers;
      const visitor = visitorCoordsRef.current;

      Object.assign(homeHit, projectPoint(HOME_COORDS, view));

      if (visitor) {
        Object.assign(visitorHit, projectPoint(visitor, view));
      } else {
        visitorHit.visible = false;
      }

      place(homeMarkerRef.current, homeHit, size);
      place(visitorMarkerRef.current, visitorHit, size);
      place(
        tooltipRef.current,
        markers.find(({ id }) => id === selectedMarkerRef.current),
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

    const hiddenSelectionLon = () => {
      const selected = selectedMarkerRef.current;
      const hit = markers.find(({ id }) => id === selected);
      const coords =
        selected === 'home' ? HOME_COORDS : visitorCoordsRef.current;

      return hit && !hit.visible && coords ? coords[1] : null;
    };

    const tick = (time: number) => {
      const elapsedSeconds = (time - lastFrameMs) / MS_PER_SECOND;
      lastFrameMs = time;
      const targetLon = hiddenSelectionLon();

      if (!drag?.dragging && targetLon !== null) {
        motion = prefersReducedMotion
          ? centerOn(motion, targetLon)
          : turnToward(motion, targetLon, elapsedSeconds);
      } else if (!drag?.dragging) {
        motion = stepIdle(motion, elapsedSeconds, autoSpinDegPerSecond());
      }

      draw();

      if (
        !drag &&
        hiddenSelectionLon() === null &&
        isAtRest(motion, autoSpinDegPerSecond())
      ) {
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
      lastFrameMs = performance.now();
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

      drag = startDrag(
        event.pointerId,
        event.clientX,
        event.clientY,
        performance.now(),
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      if (event.pointerType === 'mouse' && event.buttons === 0) {
        drag = null;
        return;
      }

      if (!drag.dragging) {
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

        onSelectRef.current(null);

        tryCapturePointer(container, event.pointerId);

        wake();
      }

      const moved = moveDrag(
        drag,
        motion,
        event.clientX,
        event.clientY,
        performance.now(),
      );
      drag = moved.drag;
      motion = moved.motion;
    };

    const endDrag = (event: PointerEvent, selectOnRelease: boolean) => {
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      if (drag.dragging) {
        motion = releaseDrag(drag, motion, performance.now());
      } else if (selectOnRelease) {
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
    const onPointerInterrupted = (event: PointerEvent) => endDrag(event, false);

    const onKeyDown = (event: KeyboardEvent) => {
      const next = nudge(motion, event.key);

      if (!next) {
        return;
      }

      event.preventDefault();
      motion = next;
      draw();
    };

    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      wake();
    };

    const sizeObserver = new ResizeObserver(([entry]) => {
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

    const tooltipSizeObserver = new ResizeObserver(([entry]) => {
      tooltipBounds.width = entry.contentRect.width;
      drawMarkers(createView(motion.lat, motion.lon));
    });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
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
    container.addEventListener('pointercancel', onPointerInterrupted);
    container.addEventListener('lostpointercapture', onPointerInterrupted);
    container.addEventListener('keydown', onKeyDown);
    reducedMotionQuery.addEventListener('change', onReducedMotionChange);
    sizeObserver.observe(container);

    if (tooltipRef.current) {
      tooltipSizeObserver.observe(tooltipRef.current);
    }
    visibilityObserver.observe(container);
    const rootObserver = new MutationObserver(() => {
      ink = readColor('--ink', COLORS.ink);
      coral = readColor('--coral', COLORS.coral);
      draw();
      wake();
    });
    rootObserver.observe(document.documentElement, {
      attributeFilter: ['class', MOTION_PAUSED_ATTRIBUTE],
      attributes: true,
    });
    window.addEventListener('resize', onWindowResize);
    controlsRef.current = { draw, measureTooltipBounds, wake };

    return () => {
      sleep();
      controlsRef.current = null;
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerInterrupted);
      container.removeEventListener('lostpointercapture', onPointerInterrupted);
      container.removeEventListener('keydown', onKeyDown);
      reducedMotionQuery.removeEventListener('change', onReducedMotionChange);
      window.removeEventListener('resize', onWindowResize);
      rootObserver.disconnect();
      sizeObserver.disconnect();
      tooltipSizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [canvasRef, containerRef, homeMarkerRef, tooltipRef, visitorMarkerRef]);

  useEffect(() => {
    selectedMarkerRef.current = selectedMarker;

    if (selectedMarker !== null) {
      controlsRef.current?.measureTooltipBounds();
    }

    controlsRef.current?.draw();
    controlsRef.current?.wake();
  }, [selectedMarker]);

  useEffect(() => {
    visitorCoordsRef.current = visitorCoords;
    controlsRef.current?.draw();
  }, [visitorCoords]);

  useEffect(() => {
    visitorDotLayerRef.current =
      visitorDots.length > 0 ? toDotLayer(visitorDots) : null;
    controlsRef.current?.draw();
  }, [visitorDots]);
};
