import { afterEach, describe, expect, it, vi } from 'vitest';
import { VISITORS_ENDPOINT } from '~/constants';
import { recordVisit } from './visitors';

const respondWith = (body: unknown, status = 200) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(body), { status })),
  );

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('recordVisit', () => {
  it('POSTs to the visitors endpoint with the abort signal', async () => {
    respondWith({ visitors: [] });
    const { signal } = new AbortController();

    await recordVisit(signal);

    expect(fetch).toHaveBeenCalledWith(
      VISITORS_ENDPOINT,
      expect.objectContaining({ method: 'POST', signal }),
    );
  });

  it('returns only valid cells', async () => {
    respondWith({
      visitors: [
        [50, -97],
        ['x', 1],
        [10, 20],
      ],
    });

    await expect(recordVisit()).resolves.toEqual([
      [50, -97],
      [10, 20],
    ]);
  });

  it('returns no cells for an unexpected body or a failure', async () => {
    respondWith('nope');
    await expect(recordVisit()).resolves.toEqual([]);

    respondWith(null);
    await expect(recordVisit()).resolves.toEqual([]);

    respondWith({ visitors: [[1, 2]] }, 503);
    await expect(recordVisit()).resolves.toEqual([]);
  });
});
