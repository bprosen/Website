import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COPY_RESET_MS } from '~/constants';
import { useCopyToClipboard } from './useCopyToClipboard';

const writeText = vi.fn(async () => {});

beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
});

afterEach(() => {
  vi.useRealTimers();
  writeText.mockReset();
});

describe('useCopyToClipboard', () => {
  it('copies the text and confirms briefly', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    let copied = false;
    await act(async () => {
      copied = await result.current.copy('hello@example.com');
    });

    expect(copied).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello@example.com');
    expect(result.current.copied).toBe(true);

    act(() => vi.advanceTimersByTime(COPY_RESET_MS));
    expect(result.current.copied).toBe(false);
  });

  it('reports failure when the clipboard is unavailable', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'));
    const { result } = renderHook(() => useCopyToClipboard());

    let copied = true;
    await act(async () => {
      copied = await result.current.copy('x');
    });

    expect(copied).toBe(false);
    expect(result.current.copied).toBe(false);
  });

  it('clears its timer when unmounted', async () => {
    const { result, unmount } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy('x');
    });
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
