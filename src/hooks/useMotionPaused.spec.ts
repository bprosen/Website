import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  MOTION_PAUSED_ATTRIBUTE,
  MOTION_PAUSED_VALUE,
  MOTION_STORAGE_KEY,
} from '~/constants';
import { useMotionPaused } from './useMotionPaused';

afterEach(() => {
  document.documentElement.removeAttribute(MOTION_PAUSED_ATTRIBUTE);
  localStorage.clear();
});

describe('useMotionPaused', () => {
  it('starts with motion running', () => {
    const { result } = renderHook(() => useMotionPaused());

    expect(result.current.paused).toBe(false);
  });

  it('pauses and resumes all motion, and remembers the choice', async () => {
    const { result } = renderHook(() => useMotionPaused());

    await act(async () => result.current.toggle());

    expect(result.current.paused).toBe(true);
    expect(document.documentElement).toHaveAttribute(MOTION_PAUSED_ATTRIBUTE);
    expect(localStorage.getItem(MOTION_STORAGE_KEY)).toBe(MOTION_PAUSED_VALUE);

    await act(async () => result.current.toggle());

    expect(result.current.paused).toBe(false);
    expect(localStorage.getItem(MOTION_STORAGE_KEY)).toBeNull();
  });

  it('picks up a pause set elsewhere on the page', async () => {
    const { result } = renderHook(() => useMotionPaused());

    await act(async () => {
      document.documentElement.setAttribute(MOTION_PAUSED_ATTRIBUTE, '');
    });

    expect(result.current.paused).toBe(true);
  });
});
