import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HOME_COORDS, MOTION_PAUSED_ATTRIBUTE } from '~/constants';
import {
  stubAnimationFrames,
  stubIntersectionObserver,
  stubReducedMotion,
} from '~/lib/testing';
import type { LatLon, MarkerId } from '~/types';
import { createView, introMotion, projectPoint } from '~/utils';
import { useGlobeMotion } from './useGlobeMotion';

const SIZE = 200;

let frames: ReturnType<typeof stubAnimationFrames>;
let observer: ReturnType<typeof stubIntersectionObserver>;
const intersect = (visible: boolean) => observer.intersect(visible);
let resizeCallbacks: ((width: number) => void)[] = [];
const resize = () => resizeCallbacks[0](SIZE);
const resizeTooltip = (width: number) => resizeCallbacks[1](width);
let resizeDisconnects: ReturnType<typeof vi.fn>[] = [];

const runFrame = (time?: number) => frames.run(time);

beforeEach(() => {
  resizeCallbacks = [];
  resizeDisconnects = [];
  frames = stubAnimationFrames();
  observer = stubIntersectionObserver();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallbacks.push((width) =>
          callback(
            [{ contentRect: { width } } as ResizeObserverEntry],
            this as unknown as ResizeObserver,
          ),
        );
      }
      observe = vi.fn();
      disconnect = (() => {
        const disconnect = vi.fn();
        resizeDisconnects.push(disconnect);
        return disconnect;
      })();
    },
  );
});

type HarnessProps = {
  visitorDots?: readonly LatLon[];
  onSelect?: (marker: MarkerId | null) => void;
  selectedMarker?: MarkerId | null;
  visitorCoords?: LatLon | null;
};

const mockContext = () => {
  const ctx = {
    arc: vi.fn(),
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    fill: vi.fn(),
    fillStyle: '',
    globalAlpha: 1,
    moveTo: vi.fn(),
    setTransform: vi.fn(),
  };
  HTMLCanvasElement.prototype.getContext = vi.fn(
    () => ctx,
  ) as unknown as HTMLCanvasElement['getContext'];
  return ctx;
};

const Harness = ({
  visitorDots = [],
  onSelect = () => {},
  selectedMarker = null,
  visitorCoords = null,
}: HarnessProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const homeMarkerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const visitorMarkerRef = useRef<HTMLSpanElement>(null);

  useGlobeMotion({
    canvasRef,
    containerRef,
    homeMarkerRef,
    onSelect,
    selectedMarker,
    tooltipRef,
    visitorCoords,
    visitorDots,
    visitorMarkerRef,
  });

  return (
    <div data-testid='globe' ref={containerRef}>
      <canvas ref={canvasRef} />
      <span data-testid='home' ref={homeMarkerRef} />
      <span data-testid='visitor' ref={visitorMarkerRef} />
      <div data-testid='tooltip' ref={tooltipRef} />
    </div>
  );
};

const pointer = (
  type: string,
  clientX: number,
  clientY: number,
  pointerType = 'mouse',
  buttons = type === 'pointerup' ? 0 : 1,
) =>
  new PointerEvent(type, {
    bubbles: true,
    button: 0,
    buttons,
    clientX,
    clientY,
    pointerId: 1,
    pointerType,
  });

const mount = (props: HarnessProps = {}) => {
  const view = render(<Harness {...props} />);
  const globe = screen.getByTestId('globe');
  globe.getBoundingClientRect = () =>
    ({ height: SIZE, left: 0, top: 0, width: SIZE }) as DOMRect;
  act(() => resize());
  return { ...view, globe };
};

const homeOnScreen = () => {
  const start = introMotion(false);
  const point = projectPoint(HOME_COORDS, createView(start.lat, start.lon));
  const round = (value: number) => Math.round((value + SIZE / 2) * 10) / 10;
  return { x: round(point.x), y: round(point.y) };
};

describe('useGlobeMotion', () => {
  it('places the home marker once sized', () => {
    mount();
    const home = homeOnScreen();

    expect(screen.getByTestId('home')).not.toHaveAttribute('data-hidden');
    expect(screen.getByTestId('home').style.transform).toBe(
      `translate3d(${home.x}px, ${home.y}px, 0)`,
    );
    expect(screen.getByTestId('visitor')).toHaveAttribute('data-hidden');
  });

  it('runs the loop only while on screen', () => {
    mount();
    expect(requestAnimationFrame).not.toHaveBeenCalled();

    act(() => intersect(true));
    expect(frames.pending()).toBe(1);

    act(() => runFrame());
    expect(frames.pending()).toBe(1);

    act(() => intersect(false));
    expect(screen.getByTestId('globe')).toHaveAttribute('data-paused');
    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(frames.pending()).toBe(0);
  });

  it('spins the globe each frame', () => {
    mount();
    const me = screen.getByTestId('home');
    const before = me.style.transform;

    act(() => intersect(true));
    act(() => runFrame(performance.now() + 100));

    expect(me.style.transform).not.toBe(before);
  });

  it("doesn't auto-spin under reduced motion", () => {
    stubReducedMotion(true);
    mount();
    act(() => intersect(true));
    act(() => runFrame());

    expect(frames.pending()).toBe(0);
  });

  it('stops spinning while motion is paused', () => {
    document.documentElement.setAttribute(MOTION_PAUSED_ATTRIBUTE, '');
    mount();
    act(() => intersect(true));

    for (let i = 0; i < 2000 && frames.pending() > 0; i++) {
      act(() => runFrame(performance.now() + i * 16));
    }

    expect(frames.pending()).toBe(0);
    document.documentElement.removeAttribute(MOTION_PAUSED_ATTRIBUTE);
  });

  it('stops spinning while a tooltip is open', () => {
    mount({ selectedMarker: 'home' });
    act(() => intersect(true));

    for (let i = 0; i < 2000 && frames.pending() > 0; i++) {
      act(() => runFrame(performance.now() + i * 16));
    }

    expect(frames.pending()).toBe(0);
    expect(screen.getByTestId('tooltip')).not.toHaveAttribute('data-hidden');
  });

  it('turns a selected marker on the far side back into view', () => {
    stubReducedMotion(true);
    const { globe, rerender } = mount();
    act(() => intersect(true));
    const spin = () =>
      globe.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
      );

    act(() => {
      for (let step = 0; step < 18; step++) {
        spin();
      }
    });
    expect(screen.getByTestId('home')).toHaveAttribute('data-hidden');

    rerender(<Harness selectedMarker='home' />);
    for (let i = 0; i < 10 && frames.pending() > 0; i++) {
      act(() => runFrame(performance.now() + i * 16));
    }

    expect(screen.getByTestId('home')).not.toHaveAttribute('data-hidden');
    expect(screen.getByTestId('tooltip')).not.toHaveAttribute('data-hidden');
  });

  it('selects a marker on tap', () => {
    const onSelect = vi.fn();
    const { globe } = mount({ onSelect });
    const home = homeOnScreen();

    act(() => {
      globe.dispatchEvent(pointer('pointerdown', home.x, home.y, 'touch'));
      globe.dispatchEvent(pointer('pointerup', home.x + 1, home.y, 'touch'));
    });

    expect(onSelect).toHaveBeenCalledWith('home');
  });

  it('clears the selection on a tap away from markers', () => {
    const onSelect = vi.fn();
    const { globe } = mount({ onSelect });

    act(() => {
      globe.dispatchEvent(pointer('pointerdown', 2, 2));
      globe.dispatchEvent(pointer('pointerup', 2, 2));
    });

    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('drags instead of tapping once past the threshold', () => {
    const onSelect = vi.fn();
    const { globe } = mount({ onSelect });
    const me = screen.getByTestId('home');
    const home = homeOnScreen();
    const before = me.style.transform;

    act(() => {
      intersect(true);
      globe.dispatchEvent(pointer('pointerdown', home.x, home.y));
      globe.dispatchEvent(pointer('pointermove', home.x + 30, home.y));
    });
    act(() => runFrame());
    act(() => {
      globe.dispatchEvent(pointer('pointerup', home.x + 30, home.y));
    });

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(null);
    expect(me.style.transform).not.toBe(before);
  });

  it('still taps when the pointer wobbles less than the drag threshold', () => {
    const onSelect = vi.fn();
    const { globe } = mount({ onSelect });
    const home = homeOnScreen();

    act(() => {
      globe.dispatchEvent(pointer('pointerdown', home.x, home.y));
      globe.dispatchEvent(pointer('pointermove', home.x + 2, home.y));
      globe.dispatchEvent(pointer('pointerup', home.x + 2, home.y));
    });

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('home');
  });

  it('ignores a second pointer while one is down', () => {
    const onSelect = vi.fn();
    const { globe } = mount({ onSelect });
    const home = homeOnScreen();
    const secondFinger = (type: string, x: number) =>
      new PointerEvent(type, {
        buttons: 1,
        clientX: x,
        clientY: home.y,
        pointerId: 2,
        pointerType: 'touch',
      });

    act(() => {
      globe.dispatchEvent(pointer('pointerdown', home.x, home.y));
      globe.dispatchEvent(secondFinger('pointermove', home.x + 60));
      globe.dispatchEvent(secondFinger('pointerup', home.x + 60));
    });

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('forgets a press that was released outside the globe', () => {
    const onSelect = vi.fn();
    const { globe } = mount({ onSelect });
    const home = homeOnScreen();

    act(() => {
      globe.dispatchEvent(pointer('pointerdown', home.x, home.y));
      globe.dispatchEvent(
        pointer('pointermove', home.x + 30, home.y, 'mouse', 0),
      );
      globe.dispatchEvent(
        pointer('pointermove', home.x + 60, home.y, 'mouse', 0),
      );
    });

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('ignores secondary mouse buttons', () => {
    const onSelect = vi.fn();
    const { globe } = mount({ onSelect });
    const home = homeOnScreen();

    act(() => {
      globe.dispatchEvent(
        new PointerEvent('pointerdown', {
          button: 2,
          clientX: home.x,
          clientY: home.y,
          pointerId: 1,
          pointerType: 'mouse',
        }),
      );
      globe.dispatchEvent(pointer('pointerup', home.x, home.y));
    });

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("doesn't tap when the browser takes over the gesture", () => {
    const onSelect = vi.fn();
    const { globe } = mount({ onSelect });
    const home = homeOnScreen();

    act(() => {
      globe.dispatchEvent(pointer('pointerdown', home.x, home.y, 'touch'));
      globe.dispatchEvent(pointer('pointercancel', home.x, home.y, 'touch'));
    });

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('rotates with the arrow keys', () => {
    const { globe } = mount();
    const me = screen.getByTestId('home');
    const before = me.style.transform;
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowLeft',
    });

    act(() => {
      globe.dispatchEvent(event);
    });

    expect(event.defaultPrevented).toBe(true);
    expect(me.style.transform).not.toBe(before);
  });

  it('leaves other keys alone', () => {
    const { globe } = mount();
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Tab',
    });

    globe.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('shows the visitor marker when they can be placed', () => {
    mount({ visitorCoords: [43.6, -79.4] });

    expect(screen.getByTestId('visitor')).not.toHaveAttribute('data-hidden');
  });

  it('cleans up listeners, observers and the loop on unmount', () => {
    const removeMediaListener = vi.fn();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: false,
        removeEventListener: removeMediaListener,
      })),
    );
    const disconnectTheme = vi.spyOn(MutationObserver.prototype, 'disconnect');
    const removeWindowListener = vi.spyOn(window, 'removeEventListener');
    const { globe, unmount } = mount();
    const remove = vi.spyOn(globe, 'removeEventListener');

    act(() => intersect(true));
    unmount();

    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(resizeDisconnects).toHaveLength(2);
    for (const disconnect of resizeDisconnects) {
      expect(disconnect).toHaveBeenCalled();
    }
    expect(observer.observers[0].disconnect).toHaveBeenCalled();
    expect(disconnectTheme).toHaveBeenCalled();
    expect(removeMediaListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
    expect(removeWindowListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
    expect(remove.mock.calls.map(([type]) => type).sort()).toEqual([
      'keydown',
      'lostpointercapture',
      'pointercancel',
      'pointerdown',
      'pointermove',
      'pointerup',
    ]);
  });

  it('draws land, then visitor dots, sized to the device pixel ratio', () => {
    const ctx = mockContext();
    vi.stubGlobal('devicePixelRatio', 3);
    const { container } = mount({ visitorDots: [[49.9, -97.1]] });
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    expect(canvas.width).toBe(SIZE * 2);
    expect(ctx.clearRect).toHaveBeenCalled();
    expect(ctx.fill).toHaveBeenCalledTimes(2);
    expect(ctx.arc.mock.calls.length).toBeGreaterThan(100);
    expect(ctx.globalAlpha).toBeLessThan(1);
  });

  it('skips the visitor layer without visitors', () => {
    const ctx = mockContext();
    mount();

    expect(ctx.fill).toHaveBeenCalledTimes(1);
  });

  it('resumes spinning when reduced motion is turned off', () => {
    let onChange: (event: { matches: boolean }) => void = () => {};
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        addEventListener: (_: string, listener: typeof onChange) => {
          onChange = listener;
        },
        matches: true,
        removeEventListener: vi.fn(),
      })),
    );
    mount();
    act(() => intersect(true));
    act(() => runFrame());
    expect(frames.pending()).toBe(0);

    act(() => onChange({ matches: false }));
    act(() => runFrame());

    expect(frames.pending()).toBe(1);
  });

  it('keeps a wide tooltip inside the viewport', () => {
    const viewport = vi
      .spyOn(document.documentElement, 'clientWidth', 'get')
      .mockReturnValue(SIZE);
    mount({ selectedMarker: 'home' });
    act(() => resizeTooltip(SIZE + 20));

    expect(screen.getByTestId('tooltip').style.transform).toBe(
      `translate3d(${SIZE / 2 - (SIZE + 20) / 2}px, ${homeOnScreen().y}px, 0)`,
    );
    viewport.mockRestore();
  });

  it('lets a tooltip extend past the globe when the viewport has room', () => {
    const viewport = vi
      .spyOn(document.documentElement, 'clientWidth', 'get')
      .mockReturnValue(1000);
    const { globe } = mount({ selectedMarker: 'home' });
    globe.getBoundingClientRect = () =>
      ({ height: SIZE, left: 400, top: 0, width: SIZE }) as DOMRect;
    act(() => {
      resize();
      resizeTooltip(SIZE + 20);
    });

    expect(screen.getByTestId('tooltip').style.transform).toBe(
      `translate3d(${homeOnScreen().x - (SIZE + 20) / 2}px, ${homeOnScreen().y}px, 0)`,
    );
    viewport.mockRestore();
  });

  it('ends a drag when pointer capture is lost', () => {
    stubReducedMotion(true);
    const onSelect = vi.fn();
    const { globe } = mount({ onSelect });
    const home = homeOnScreen();

    act(() => {
      intersect(true);
      globe.dispatchEvent(pointer('pointerdown', home.x, home.y));
      globe.dispatchEvent(pointer('pointermove', home.x + 30, home.y));
      globe.dispatchEvent(pointer('lostpointercapture', home.x + 30, home.y));
    });
    for (let i = 0; i < 2000 && frames.pending() > 0; i++) {
      act(() => runFrame(performance.now() + i * 16));
    }

    expect(frames.pending()).toBe(0);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('redraws when the theme changes', async () => {
    const ctx = mockContext();
    mount();
    const fills = ctx.fill.mock.calls.length;

    document.documentElement.classList.add('dark');
    await act(async () => {});

    expect(ctx.fill.mock.calls.length).toBeGreaterThan(fills);
    document.documentElement.classList.remove('dark');
  });
});
