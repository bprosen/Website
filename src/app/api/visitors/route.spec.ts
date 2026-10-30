// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VISITORS_RATE_LIMIT } from '~/constants';
import { POST } from './route';

const REDIS_URL = 'https://redis.example';
const TOKEN = 'secret-token';

const okResponse = (result: unknown) =>
  new Response(
    JSON.stringify([{ result: 1 }, { result: 0 }, { result: 0 }, { result }]),
    { status: 200 },
  );

const request = (headers: Record<string, string> = {}) =>
  new Request('http://localhost/api/visitors', {
    headers: { 'sec-fetch-site': 'same-origin', ...headers },
    method: 'POST',
  });

const geoHeaders = {
  'x-vercel-ip-latitude': '49.8951',
  'x-vercel-ip-longitude': '-97.1384',
};

const fetchMock = vi.fn<typeof fetch>();

const sentBody = () => {
  const init = fetchMock.mock.calls[0]?.[1];
  return String(init?.body);
};

const sentCommands = (): unknown[][] => JSON.parse(sentBody());

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('UPSTASH_KV_REST_API_URL', REDIS_URL);
  vi.stubEnv('UPSTASH_KV_REST_API_TOKEN', TOKEN);
  fetchMock.mockResolvedValue(okResponse(['50,-97', '-34,151']));
});

afterEach(() => {
  fetchMock.mockReset();
});

describe('POST /api/visitors', () => {
  it('records the rounded cell, trims and reads in one pipeline call', async () => {
    const response = await POST(request(geoHeaders));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${REDIS_URL}/pipeline`);
    expect(init).toMatchObject({
      cache: 'no-store',
      headers: { Authorization: `Bearer ${TOKEN}` },
      method: 'POST',
    });
    expect(init?.signal).toBeInstanceOf(AbortSignal);

    const commands = sentCommands();
    expect(commands.map(([name]) => name)).toEqual([
      'ZADD',
      'ZREMRANGEBYSCORE',
      'ZREMRANGEBYRANK',
      'ZREVRANGE',
    ]);
    expect(commands[0]).toEqual([
      'ZADD',
      'visitors',
      expect.any(Number),
      '50,-97',
    ]);
    expect(commands[1]).toEqual([
      'ZREMRANGEBYSCORE',
      'visitors',
      '-inf',
      expect.any(Number),
    ]);
    expect(commands[2]).toEqual(['ZREMRANGEBYRANK', 'visitors', 0, -151]);
    expect(commands[3]).toEqual(['ZREVRANGE', 'visitors', 0, 149]);
    expect(response.status).toBe(200);
  });

  it('never sends unrounded coordinates', async () => {
    await POST(request(geoHeaders));

    const body = sentBody();
    expect(body).not.toContain('49.8951');
    expect(body).not.toContain('-97.1384');
    expect(body).not.toContain('49.');
    expect(body).not.toContain('97.');
  });

  it('returns the list as numeric pairs with Cache-Control: no-store', async () => {
    const response = await POST(request(geoHeaders));

    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({
      visitors: [
        [50, -97],
        [-34, 151],
      ],
    });
  });

  it('drops malformed cells from the Redis result', async () => {
    fetchMock.mockResolvedValue(okResponse(['50,-97', 'junk', 7, '99,0']));

    const response = await POST(request(geoHeaders));

    expect(await response.json()).toEqual({ visitors: [[50, -97]] });
  });

  it.each([
    ['Sec-GPC', { 'Sec-GPC': '1' }],
    ['DNT', { DNT: '1' }],
  ])(
    'skips recording with %s but still returns the list',
    async (_label, optOut) => {
      const response = await POST(request({ ...geoHeaders, ...optOut }));

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(sentCommands().map(([name]) => name)).not.toContain('ZADD');
      expect(sentBody()).not.toContain('50,-97');
      expect(await response.json()).toEqual({
        visitors: [
          [50, -97],
          [-34, 151],
        ],
      });
    },
  );

  it('skips recording without geo headers but still returns the list', async () => {
    const response = await POST(request());

    expect(sentCommands().map(([name]) => name)).toEqual([
      'ZREMRANGEBYSCORE',
      'ZREMRANGEBYRANK',
      'ZREVRANGE',
    ]);
    expect((await response.json()).visitors).toHaveLength(2);
  });

  it('returns [] without calling fetch when env is missing', async () => {
    vi.stubEnv('UPSTASH_KV_REST_API_URL', '');
    vi.stubEnv('UPSTASH_KV_REST_API_TOKEN', '');

    const response = await POST(request(geoHeaders));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({ visitors: [] });
  });

  it.each([
    ['a Redis error', () => new Response(JSON.stringify([{ error: 'ERR' }]))],
    ['a non-OK response', () => new Response('nope', { status: 500 })],
    ['a non-JSON body', () => new Response('not json', { status: 200 })],
    ['a malformed body', () => new Response(JSON.stringify({ result: [] }))],
  ])('returns [] on %s', async (_label, makeResponse) => {
    fetchMock.mockResolvedValue(makeResponse());

    const response = await POST(request(geoHeaders));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ visitors: [] });
  });

  it('returns [] when fetch throws', async () => {
    fetchMock.mockRejectedValue(new DOMException('timed out', 'TimeoutError'));

    const response = await POST(request(geoHeaders));

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({ visitors: [] });
  });

  it('refuses requests from other sites without touching Redis', async () => {
    const response = await POST(request({ 'sec-fetch-site': 'cross-site' }));

    expect(fetchMock).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ visitors: [] });
  });

  it('accepts a same-origin request from a browser that sends no fetch metadata', async () => {
    await POST(
      new Request('http://10.0.0.5:3000/api/visitors', {
        headers: { host: '10.0.0.5:3000', origin: 'http://10.0.0.5:3000' },
        method: 'POST',
      }),
    );

    expect(fetchMock).toHaveBeenCalled();
  });

  it('stops answering a client that sends too many requests', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify([{ result: VISITORS_RATE_LIMIT + 1 }]), {
        status: 200,
      }),
    );

    const response = await POST(request({ 'x-real-ip': '203.0.113.7' }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentCommands().map(([name]) => name)).toEqual(['INCR', 'EXPIRE']);
    expect(String(sentCommands()[0][1])).not.toContain('203.0.113.7');
    await expect(response.json()).resolves.toEqual({ visitors: [] });
  });

  it('records visits from a client within the limit', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify([{ result: 1 }]), { status: 200 }),
    );

    await POST(request({ ...geoHeaders, 'x-real-ip': '203.0.113.7' }));

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
