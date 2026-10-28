import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { UNKNOWN_VISITOR } from '~/utils';
import { useVisitor } from './useVisitor';

const mockZone = (timeZone: string | undefined) =>
  vi
    .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
    .mockReturnValue({ timeZone } as Intl.ResolvedDateTimeFormatOptions);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useVisitor', () => {
  it('starts unknown, then places the visitor from their zone', async () => {
    mockZone('America/Toronto');
    const { result } = renderHook(() => useVisitor());

    expect(result.current).toBe(UNKNOWN_VISITOR);
    await waitFor(() => expect(result.current.label).toBe('You, near Toronto'));
    expect(result.current.coords).toEqual([43.6, -79.4]);
  });

  it('recognises visitors in Winnipeg', async () => {
    mockZone('America/Winnipeg');
    const { result } = renderHook(() => useVisitor());

    await waitFor(() => expect(result.current.sameCity).toBe(true));
  });

  it('stays unknown without a time zone', async () => {
    mockZone(undefined);
    const { result } = renderHook(() => useVisitor());

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(result.current).toBe(UNKNOWN_VISITOR);
  });

  it('stays unknown for unlisted zones', async () => {
    mockZone('Etc/Unknown');
    const { result } = renderHook(() => useVisitor());

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(result.current.label).toBe('You');
  });
});
