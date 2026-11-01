import { describe, expect, it } from 'vitest';
import { VISITORS_ENDPOINT } from '~/constants';
import { stubFetchJson } from '~/lib/testing';
import { recordVisit } from './visitors';

const empty = { dots: [], location: null };

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

    await expect(recordVisit()).resolves.toEqual({
      dots: [
        [50, -97],
        [10, 20],
      ],
      location: null,
    });
  });

  it("returns the visitor's own location", async () => {
    stubFetchJson({
      location: { city: 'Toronto', coords: [43.6, -79.4] },
      visitors: [],
    });

    await expect(recordVisit()).resolves.toEqual({
      dots: [],
      location: { city: 'Toronto', coords: [43.6, -79.4] },
    });
  });

  it('drops an invalid location', async () => {
    stubFetchJson({ location: { coords: 'here' }, visitors: [[1, 2]] });

    await expect(recordVisit()).resolves.toEqual({
      dots: [[1, 2]],
      location: null,
    });
  });

  it('returns nothing for an unexpected body or a failure', async () => {
    stubFetchJson('nope');
    await expect(recordVisit()).resolves.toEqual(empty);

    stubFetchJson(null);
    await expect(recordVisit()).resolves.toEqual(empty);

    stubFetchJson({ visitors: [[1, 2]] }, 503);
    await expect(recordVisit()).resolves.toEqual(empty);
  });
});
