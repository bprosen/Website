import { describe, expect, it } from 'vitest';
import { VISITORS_ENDPOINT } from '~/constants';
import { stubFetchJson } from '~/lib/testing';
import { recordVisit } from './visitors';

describe('recordVisit', () => {
  it('POSTs to the visitors endpoint with the abort signal', async () => {
    stubFetchJson({ visitors: [] });
    const { signal } = new AbortController();

    await recordVisit(signal);

    expect(fetch).toHaveBeenCalledWith(
      VISITORS_ENDPOINT,
      expect.objectContaining({ method: 'POST', signal }),
    );
  });

  it('returns only valid cells', async () => {
    stubFetchJson({
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
    stubFetchJson('nope');
    await expect(recordVisit()).resolves.toEqual([]);

    stubFetchJson(null);
    await expect(recordVisit()).resolves.toEqual([]);

    stubFetchJson({ visitors: [[1, 2]] }, 503);
    await expect(recordVisit()).resolves.toEqual([]);
  });
});
