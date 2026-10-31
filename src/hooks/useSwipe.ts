import { type TouchEvent, useRef } from 'react';
import { swipeStep } from '~/utils';

type Point = {
  x: number;
  y: number;
};

export const useSwipe = (onStep: (step: -1 | 1) => void) => {
  const startRef = useRef<Point | null>(null);

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    startRef.current =
      event.touches.length === 1 && touch
        ? { x: touch.clientX, y: touch.clientY }
        : null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    const start = startRef.current;
    const touch = event.changedTouches[0];
    startRef.current = null;

    if (!start || !touch) {
      return;
    }

    const step = swipeStep(touch.clientX - start.x, touch.clientY - start.y);

    if (step !== 0) {
      onStep(step);
    }
  };

  return { onTouchEnd, onTouchStart };
};
