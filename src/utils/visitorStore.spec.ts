import { describe, expect, it } from 'vitest';
import { VISITORS_RATE_WINDOW_SECONDS, VISITORS_TTL_MS } from '~/constants';
import {
  buildPipeline,
  buildRateLimitPipeline,
  clientAddress,
  isSameOriginRequest,
  parseCells,
  parseGeoHeaders,
  parsePipelineResponse,
  parseRequestCount,
  rateLimitKey,
  readRedisConfig,
  shouldRecord,
  toCell,
} from './visitorStore';

const geo = (lat?: string, lon?: string) => {
  const headers = new Headers();
  if (lat !== undefined) headers.set('x-vercel-ip-latitude', lat);
  if (lon !== undefined) headers.set('x-vercel-ip-longitude', lon);
  return headers;
};

describe('parseGeoHeaders', () => {
  it('parses valid coordinates', () => {
    expect(parseGeoHeaders(geo('49.8951', '-97.1384'))).toEqual([
      49.8951, -97.1384,
    ]);
  });

  it('accepts the exact range limits', () => {
    expect(parseGeoHeaders(geo('90', '180'))).toEqual([90, 180]);
    expect(parseGeoHeaders(geo('-90', '-180'))).toEqual([-90, -180]);
  });

  it('trims surrounding whitespace', () => {
    expect(parseGeoHeaders(geo(' 10.5 ', ' 20 '))).toEqual([10.5, 20]);
  });

  it.each([
    ['both headers missing', undefined, undefined],
    ['latitude missing', undefined, '20'],
    ['longitude missing', '10', undefined],
    ['blank latitude', '', '20'],
    ['whitespace longitude', '10', '   '],
    ['non-numeric latitude', 'abc', '20'],
    ['non-numeric longitude', '10', '20deg'],
    ['NaN', 'NaN', '20'],
    ['Infinity', 'Infinity', '20'],
    ['latitude above 90', '90.01', '20'],
    ['latitude below -90', '-91', '20'],
    ['longitude above 180', '10', '180.5'],
    ['longitude below -180', '10', '-181'],
  ])('returns null for %s', (_label, lat, lon) => {
    expect(parseGeoHeaders(geo(lat, lon))).toBeNull();
  });
});

describe('toCell', () => {
  it('rounds to the nearest degree', () => {
    expect(toCell([49.8951, -97.1384])).toBe('50,-97');
    expect(toCell([12.4, 33.6])).toBe('12,34');
  });

  it('rounds negative numbers with Math.round semantics', () => {
    expect(toCell([-33.87, -151.21])).toBe('-34,-151');
    expect(toCell([-1.5, -2.5])).toBe('-1,-2');
  });

  it('normalizes -0 to 0', () => {
    expect(toCell([-0.4, -0.2])).toBe('0,0');
    expect(toCell([-0, 0])).toBe('0,0');
  });

  it('keeps edge values in range', () => {
    expect(toCell([89.7, 179.6])).toBe('90,180');
    expect(toCell([-89.7, -179.6])).toBe('-90,-180');
  });
});

describe('parseCells', () => {
  it('parses well-formed cells in order', () => {
    expect(parseCells(['50,-97', '-34,151', '0,0'])).toEqual([
      [50, -97],
      [-34, 151],
      [0, 0],
    ]);
  });

  it('normalizes -0 cells', () => {
    const [[lat, lon]] = parseCells(['-0,-0']);
    expect(Object.is(lat, 0)).toBe(true);
    expect(Object.is(lon, 0)).toBe(true);
  });

  it.each([null, undefined, 'not-an-array', 42, { result: [] }])(
    'returns [] for non-array input %j',
    (value) => {
      expect(parseCells(value)).toEqual([]);
    },
  );

  it('ignores malformed and out-of-range entries', () => {
    expect(
      parseCells([
        '50,-97',
        '',
        '50',
        '50,-97,1',
        '50.5,-97',
        'a,b',
        ' 50,-97',
        '91,0',
        '0,181',
        '-91,0',
        '1000,0',
        42,
        null,
        ['50', '-97'],
        { lat: 50 },
        '10,20',
      ]),
    ).toEqual([
      [50, -97],
      [10, 20],
    ]);
  });
});

describe('shouldRecord', () => {
  it('records by default', () => {
    expect(shouldRecord(new Headers())).toBe(true);
  });

  it('skips when Sec-GPC is 1', () => {
    expect(shouldRecord(new Headers({ 'Sec-GPC': '1' }))).toBe(false);
  });

  it('skips when DNT is 1', () => {
    expect(shouldRecord(new Headers({ DNT: '1' }))).toBe(false);
  });

  it('records when the headers are set to something other than 1', () => {
    expect(shouldRecord(new Headers({ DNT: '0', 'Sec-GPC': '0' }))).toBe(true);
  });
});

describe('buildPipeline', () => {
  const now = 1_700_000_000_000;

  it('records, trims and reads when given a cell', () => {
    expect(buildPipeline('50,-97', now)).toEqual([
      ['ZADD', 'visitors', now, '50,-97'],
      ['ZREMRANGEBYSCORE', 'visitors', '-inf', now - VISITORS_TTL_MS],
      ['ZREMRANGEBYRANK', 'visitors', 0, -151],
      ['ZREVRANGE', 'visitors', 0, 149],
    ]);
  });

  it('only trims and reads without a cell', () => {
    expect(buildPipeline(null, now)).toEqual([
      ['ZREMRANGEBYSCORE', 'visitors', '-inf', now - VISITORS_TTL_MS],
      ['ZREMRANGEBYRANK', 'visitors', 0, -151],
      ['ZREVRANGE', 'visitors', 0, 149],
    ]);
  });

  it('uses a 30 day TTL', () => {
    expect(VISITORS_TTL_MS).toBe(2_592_000_000);
  });
});

describe('parsePipelineResponse', () => {
  it('reads the last result', () => {
    expect(
      parsePipelineResponse([
        { result: 1 },
        { result: 0 },
        { result: 0 },
        { result: ['50,-97', '10,20'] },
      ]),
    ).toEqual([
      [50, -97],
      [10, 20],
    ]);
  });

  it('still reads the list when an earlier command failed', () => {
    expect(
      parsePipelineResponse([{ error: 'WRONGTYPE' }, { result: ['1,2'] }]),
    ).toEqual([[1, 2]]);
  });

  it.each([
    ['null', null],
    ['an object', { result: ['1,2'] }],
    ['an empty array', []],
    ['a null last entry', [{ result: 1 }, null]],
    ['a string last entry', ['1,2']],
    ['an error last entry', [{ error: 'ERR' }]],
    ['a last entry without result', [{}]],
    ['a non-array result', [{ result: '1,2' }]],
  ])('returns [] for %s', (_label, body) => {
    expect(parsePipelineResponse(body)).toEqual([]);
  });
});

describe('readRedisConfig', () => {
  const env = {
    UPSTASH_KV_REST_API_TOKEN: 'token',
    UPSTASH_KV_REST_API_URL: 'https://redis.example',
  };

  it('reads the Upstash REST URL and read-write token', () => {
    expect(readRedisConfig(env)).toEqual({
      token: 'token',
      url: 'https://redis.example',
    });
  });

  it('never uses the read-only token', () => {
    expect(
      readRedisConfig({
        UPSTASH_KV_REST_API_READ_ONLY_TOKEN: 'read-only',
        UPSTASH_KV_REST_API_URL: 'https://redis.example',
      }),
    ).toBeNull();
  });

  it('returns null when nothing is set', () => {
    expect(readRedisConfig({})).toBeNull();
  });

  it('returns null when either value is missing or empty', () => {
    expect(
      readRedisConfig({ UPSTASH_KV_REST_API_URL: 'https://redis.example' }),
    ).toBeNull();
    expect(
      readRedisConfig({ ...env, UPSTASH_KV_REST_API_TOKEN: '' }),
    ).toBeNull();
  });

  it('strips trailing slashes from the URL', () => {
    expect(
      readRedisConfig({
        ...env,
        UPSTASH_KV_REST_API_URL: 'https://x.example//',
      }),
    ).toEqual({ token: 'token', url: 'https://x.example' });
  });
});

describe('isSameOriginRequest', () => {
  it('trusts the browser fetch metadata when it is present', () => {
    expect(
      isSameOriginRequest(new Headers({ 'sec-fetch-site': 'same-origin' })),
    ).toBe(true);
    expect(
      isSameOriginRequest(new Headers({ 'sec-fetch-site': 'cross-site' })),
    ).toBe(false);
  });

  it('falls back to comparing the origin with the host', () => {
    expect(
      isSameOriginRequest(
        new Headers({ host: 'bprosen.dev', origin: 'https://bprosen.dev' }),
      ),
    ).toBe(true);
    expect(
      isSameOriginRequest(
        new Headers({ host: 'bprosen.dev', origin: 'https://evil.example' }),
      ),
    ).toBe(false);
    expect(isSameOriginRequest(new Headers({ origin: 'not a url' }))).toBe(
      false,
    );
    expect(isSameOriginRequest(new Headers())).toBe(false);
  });
});

describe('clientAddress', () => {
  it('prefers the address the platform sets', () => {
    expect(
      clientAddress(
        new Headers({
          'x-forwarded-for': '198.51.100.1, 10.0.0.1',
          'x-real-ip': '203.0.113.7',
        }),
      ),
    ).toBe('203.0.113.7');
  });

  it('falls back to the first forwarded address', () => {
    expect(
      clientAddress(
        new Headers({ 'x-forwarded-for': '198.51.100.1, 10.0.0.1' }),
      ),
    ).toBe('198.51.100.1');
  });

  it('is null without either header', () => {
    expect(clientAddress(new Headers())).toBeNull();
  });
});

describe('rateLimitKey', () => {
  it('hashes the address so the raw IP is never stored', async () => {
    const key = await rateLimitKey('203.0.113.7');

    expect(key).toMatch(/^visitors:rate:[0-9a-f]{64}$/);
    expect(key).not.toContain('203.0.113.7');
    await expect(rateLimitKey('203.0.113.7')).resolves.toBe(key);
    await expect(rateLimitKey('203.0.113.8')).resolves.not.toBe(key);
  });
});

describe('buildRateLimitPipeline', () => {
  it('counts the request and starts the window on the first one', () => {
    expect(buildRateLimitPipeline('visitors:rate:abc')).toEqual([
      ['INCR', 'visitors:rate:abc'],
      ['EXPIRE', 'visitors:rate:abc', VISITORS_RATE_WINDOW_SECONDS, 'NX'],
    ]);
  });
});

describe('parseRequestCount', () => {
  it('reads the count from the first command', () => {
    expect(parseRequestCount([{ result: 4 }, { result: 1 }])).toBe(4);
  });

  it('treats anything unexpected as no requests yet', () => {
    expect(parseRequestCount(null)).toBe(0);
    expect(parseRequestCount([{ error: 'boom' }])).toBe(0);
    expect(parseRequestCount([{ result: 'x' }])).toBe(0);
  });
});
