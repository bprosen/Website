import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REVEAL_READY_CLASS, REVEALED_ATTRIBUTE } from '~/constants';
import { stubIntersectionObserver } from '~/lib/testing';
import { useScrollReveal } from './useScrollReveal';

let observer: ReturnType<typeof stubIntersectionObserver>;
const intersect = (entries: Partial<IntersectionObserverEntry>[]) =>
  observer.intersect(entries);
const observed = () => observer.observers[0];

const placeAt = (element: Element, top: number) =>
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    top,
  } as DOMRect);

const setUpPage = () => {
  document.body.innerHTML = `
    <h2 data-reveal id="seen">Seen</h2>
    <div data-reveal-group><p id="first">One</p><p id="second">Two</p></div>
    <p id="plain">Plain</p>
  `;
  const byId = (id: string) => document.getElementById(id) as HTMLElement;
  placeAt(byId('seen'), 100);
  placeAt(byId('first'), 2000);
  placeAt(byId('second'), 2400);
  return byId;
};

describe('useScrollReveal', () => {
  beforeEach(() => {
    observer = stubIntersectionObserver();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('shows content that is already on screen without animating it', () => {
    const byId = setUpPage();
    renderHook(() => useScrollReveal());

    expect(byId('seen')).toHaveAttribute(REVEALED_ATTRIBUTE);
    expect(observed().observe).not.toHaveBeenCalledWith(byId('seen'));
    expect(document.documentElement).toHaveClass(REVEAL_READY_CLASS);
  });

  it('reveals each group child once as it scrolls into view', () => {
    const byId = setUpPage();
    renderHook(() => useScrollReveal());

    expect(observed().observe).toHaveBeenCalledWith(byId('first'));
    expect(observed().observe).toHaveBeenCalledWith(byId('second'));
    expect(observed().observe).not.toHaveBeenCalledWith(byId('plain'));

    act(() => intersect([{ isIntersecting: true, target: byId('first') }]));

    expect(byId('first')).toHaveAttribute(REVEALED_ATTRIBUTE);
    expect(byId('second')).not.toHaveAttribute(REVEALED_ATTRIBUTE);
    expect(observed().unobserve).toHaveBeenCalledWith(byId('first'));
  });

  it('stops watching and drops the ready flag on unmount', () => {
    setUpPage();
    const { unmount } = renderHook(() => useScrollReveal());

    unmount();

    expect(observed().disconnect).toHaveBeenCalled();
    expect(document.documentElement).not.toHaveClass(REVEAL_READY_CLASS);
  });
});
