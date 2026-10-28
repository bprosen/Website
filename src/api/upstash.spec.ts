// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { runVisitorsPipeline } from './upstash';

const config = { token: 'secret', url: 'https://redis.example' };
const commands = [['ZREVRANGE', 'visitors', 0, 149]];

const respondWith = (body: unknown, status = 200) => {
  const fetchMock = vi.fn(
    async () => new Response(JSON.stringify(body), { status }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('runVisitorsPipeline', () => {
  it('sends the commands to the pipeline endpoint with the token and a timeout', async () => {
    const fetchMock = respondWith([{ result: [] }]);

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
  });

  it('returns the cells from the last command', async () => {
    respondWith([{ result: 1 }, { result: ['50,-97'] }]);

    await expect(runVisitorsPipeline(config, commands)).resolves.toEqual([
      [50, -97],
    ]);
  });

  it('returns no cells when Redis fails', async () => {
    respondWith({ error: 'nope' }, 500);

    await expect(runVisitorsPipeline(config, commands)).resolves.toEqual([]);
  });
});
