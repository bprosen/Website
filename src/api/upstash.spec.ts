// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { REDIS_TIMEOUT_MS, VISITORS_RATE_WINDOW_SECONDS } from '~/constants';
import { stubFetchJson } from '~/lib/testing';
import { countVisitorRequest, runVisitorsPipeline } from './upstash';

const config = { token: 'secret', url: 'https://redis.example' };
const commands = [['ZREVRANGE', 'visitors', 0, 149]];

describe('runVisitorsPipeline', () => {
  it('sends the commands to the pipeline endpoint with the token and a timeout', async () => {
    const fetchMock = stubFetchJson([{ result: [] }]);
    const timeout = vi.spyOn(AbortSignal, 'timeout');

    await runVisitorsPipeline(config, commands);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe('https://redis.example/pipeline');
    expect(init).toMatchObject({
      body: JSON.stringify(commands),
      headers: { Authorization: 'Bearer secret' },
      method: 'POST',
    });
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(timeout).toHaveBeenCalledWith(REDIS_TIMEOUT_MS);
  });

  it('returns the cells from the last command', async () => {
    stubFetchJson([{ result: 1 }, { result: ['50,-97'] }]);

    await expect(runVisitorsPipeline(config, commands)).resolves.toEqual([
      [50, -97],
    ]);
  });

  it('returns no cells when Redis fails', async () => {
    stubFetchJson({ error: 'nope' }, 500);

    await expect(runVisitorsPipeline(config, commands)).resolves.toEqual([]);
  });
});

describe('countVisitorRequest', () => {
  it('counts the request under the given key', async () => {
    const fetchMock = stubFetchJson([{ result: 3 }, { result: 1 }]);

    await expect(
      countVisitorRequest(config, 'visitors:rate:abc'),
    ).resolves.toBe(3);
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual([
      ['INCR', 'visitors:rate:abc'],
      ['EXPIRE', 'visitors:rate:abc', VISITORS_RATE_WINDOW_SECONDS, 'NX'],
    ]);
  });
});
