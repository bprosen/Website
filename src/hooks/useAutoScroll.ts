import { type RefObject, useEffect } from 'react';
import { AUTO_SCROLL_RESUME_MS, SCROLL_SYNC_TOLERANCE_PX } from '~/constants';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const loopWidthOf = (scroller: HTMLElement) => {
  const items = scroller.firstElementChild?.children;
  if (!items || items.length < 2) {
    return 0;
  }
  const first = items[0] as HTMLElement;
  const firstCopy = items[Math.floor(items.length / 2)] as HTMLElement;
  return firstCopy.offsetLeft - first.offsetLeft;
};

const wrapPosition = (position: number, loopWidth: number) =>
  loopWidth > 0 && position >= loopWidth ? position - loopWidth : position;

export const useAutoScroll = (
  ref: RefObject<HTMLElement | null>,
  speedPxPerSecond: number,
) => {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const scroller = ref.current;
    if (!scroller || reducedMotion) {
      return;
    }

    let frame = 0;
    let lastTime: number | null = null;
    let position = scroller.scrollLeft;
    let held = false;
    let resumeAt = 0;

    const step = (time: number) => {
      if (Math.abs(scroller.scrollLeft - position) > SCROLL_SYNC_TOLERANCE_PX) {
        position = scroller.scrollLeft;
      }
      if (lastTime !== null && !held && time >= resumeAt) {
        position = wrapPosition(
          position + (speedPxPerSecond * (time - lastTime)) / 1000,
          loopWidthOf(scroller),
        );
        scroller.scrollLeft = position;
      }
      lastTime = time;
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (!frame) {
        lastTime = null;
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
      resumeAt = performance.now() + AUTO_SCROLL_RESUME_MS;
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

    const listeners = [
      ['pointerenter', holdForMouse],
      ['pointerleave', releaseForMouse],
      ['touchstart', hold],
      ['touchend', release],
      ['touchcancel', release],
      ['focusin', holdForKeyboard],
      ['focusout', release],
      ['wheel', pauseBriefly],
    ] as const;

    for (const [type, listener] of listeners) {
      scroller.addEventListener(type, listener as EventListener, {
        passive: true,
      });
    }

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
      for (const [type, listener] of listeners) {
        scroller.removeEventListener(type, listener as EventListener);
      }
    };
  }, [ref, reducedMotion, speedPxPerSecond]);
};
