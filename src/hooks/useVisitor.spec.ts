import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UNKNOWN_VISITOR } from '~/utils';
import { useVisitor } from './useVisitor';

const zoneTableReads = vi.hoisted(() => vi.fn());

vi.mock('~/constants/timezones', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/constants/timezones')>();
  return {
    get TIME_ZONES() {
      zoneTableReads();
      return actual.TIME_ZONES;
    },
  };
});

const settle = () =>
  act(async () => {
    await vi.dynamicImportSettled();
  });

const mockZone = (timeZone: string | undefined) =>
  vi
    .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
    .mockReturnValue({ timeZone } as Intl.ResolvedDateTimeFormatOptions);

describe('useVisitor', () => {
  it('starts unknown, then places the visitor from their zone', async () => {
    mockZone('America/Toronto');
    const { result } = renderHook(() => useVisitor({ enabled: true }));

    expect(result.current).toBe(UNKNOWN_VISITOR);
    await waitFor(() => expect(result.current.label).toBe('You, near Toronto'));
    expect(result.current.coords).toEqual([43.6, -79.4]);
  });

  it('recognizes visitors in Winnipeg', async () => {
    mockZone('America/Winnipeg');
    const { result } = renderHook(() => useVisitor({ enabled: true }));

    await waitFor(() => expect(result.current.sameCity).toBe(true));
  });

  it('does nothing while the globe card is hidden', async () => {
    mockZone('America/Toronto');
    const { result } = renderHook(() => useVisitor({ enabled: false }));

    await settle();

    expect(zoneTableReads).not.toHaveBeenCalled();
    expect(result.current).toBe(UNKNOWN_VISITOR);
  });

  it("doesn't load the zone table without a time zone", async () => {
    mockZone(undefined);
    const { result } = renderHook(() => useVisitor({ enabled: true }));

    await settle();

    expect(zoneTableReads).not.toHaveBeenCalled();
    expect(result.current).toBe(UNKNOWN_VISITOR);
  });

  it('stays unknown for unlisted zones', async () => {
    mockZone('Etc/Unknown');
    const { result } = renderHook(() => useVisitor({ enabled: true }));

    await waitFor(() => expect(zoneTableReads).toHaveBeenCalled());
    expect(result.current).toBe(UNKNOWN_VISITOR);
  });
});
