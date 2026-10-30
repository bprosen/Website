import { type RefObject, useEffect } from 'react';
import {
  AUTO_SCROLL_RESUME_MS,
  MS_PER_SECOND,
  SCROLL_SYNC_TOLERANCE_PX,
} from '~/constants';
import { useMotionPaused } from './useMotionPaused';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const measureLoopWidth = (scroller: HTMLElement) => {
  const items = scroller.firstElementChild?.children;

  if (!items || items.length < 2) {
    return 0;
  }

  const first = items[0];
  const firstCopy = items[Math.floor(items.length / 2)];

  if (!(first instanceof HTMLElement) || !(firstCopy instanceof HTMLElement)) {
    return 0;
  }

  return firstCopy.offsetLeft - first.offsetLeft;
};

const wrapPosition = (position: number, loopWidth: number) =>
  loopWidth > 0 && position >= loopWidth ? position - loopWidth : position;

export const useAutoScroll = (
  ref: RefObject<HTMLElement | null>,
  speedPxPerSecond: number,
) => {
  const reducedMotion = usePrefersReducedMotion();
  const { paused } = useMotionPaused();

  useEffect(() => {
    const scroller = ref.current;
    if (!scroller || reducedMotion || paused) {
      return;
    }

    let frame = 0;
    let lastFrameMs: number | null = null;
    let position = scroller.scrollLeft;
    let held = false;
    let resumeAtMs = 0;

    const step = (time: number) => {
      if (Math.abs(scroller.scrollLeft - position) > SCROLL_SYNC_TOLERANCE_PX) {
        position = scroller.scrollLeft;
      }
      if (lastFrameMs !== null && !held && time >= resumeAtMs) {
        position = wrapPosition(
          position + (speedPxPerSecond * (time - lastFrameMs)) / MS_PER_SECOND,
          measureLoopWidth(scroller),
        );
        scroller.scrollLeft = position;
      }
      lastFrameMs = time;
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (!frame) {
        lastFrameMs = null;
        frame = requestAnimationFrame(step);
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const hold = () => {
      held = true;
    };
    const pauseBriefly = () => {
      resumeAtMs = performance.now() + AUTO_SCROLL_RESUME_MS;
    };
    const release = () => {
      held = false;
      pauseBriefly();
    };
    const holdForKeyboard = (event: FocusEvent) => {
      if (
        event.target instanceof Element &&
        event.target.matches(':focus-visible')
      ) {
        hold();
      }
    };
    const holdForMouse = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') {
        hold();
      }
    };
    const releaseForMouse = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') {
        release();
      }
    };

    const listen = <Type extends keyof HTMLElementEventMap>(
      type: Type,
      listener: (event: HTMLElementEventMap[Type]) => void,
    ) => {
      scroller.addEventListener(type, listener, { passive: true });
      return () => scroller.removeEventListener(type, listener);
    };

    const unlisteners = [
      listen('pointerenter', holdForMouse),
      listen('pointerleave', releaseForMouse),
      listen('touchstart', hold),
      listen('touchend', release),
      listen('touchcancel', release),
      listen('focusin', holdForKeyboard),
      listen('focusout', release),
      listen('wheel', pauseBriefly),
    ];

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
      }
    });
    visibility.observe(scroller);

    return () => {
      stop();
      visibility.disconnect();
      for (const unlisten of unlisteners) {
        unlisten();
      }
    };
  }, [paused, ref, reducedMotion, speedPxPerSecond]);
};
