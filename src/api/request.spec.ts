import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { requestJson } from './request';

const fetchMock = vi.fn<typeof fetch>();
const parse = vi.fn((body: unknown) => body as string);

const respond = (body: unknown, status = 200) =>
  fetchMock.mockResolvedValue(new Response(JSON.stringify(body), { status }));

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  respond('parsed');
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe('requestJson', () => {
  it('GETs without a body and parses the JSON response', async () => {
    await expect(
      requestJson('/api/x', { fallback: 'none', parse }),
    ).resolves.toBe('parsed');

    expect(fetchMock).toHaveBeenCalledWith('/api/x', {
      body: undefined,
      cache: 'no-store',
      headers: undefined,
      method: 'GET',
      signal: undefined,
    });
  });

  it('sends a JSON body with merged headers', async () => {
    await requestJson('/api/x', {
      body: { a: 1 },
      fallback: 'none',
      headers: { Authorization: 'Bearer t' },
      method: 'POST',
      parse,
    });

    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      body: '{"a":1}',
      headers: {
        Authorization: 'Bearer t',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  });

  it('passes the caller signal through', async () => {
    const { signal } = new AbortController();

    await requestJson('/api/x', { fallback: 'none', parse, signal });

    expect(fetchMock.mock.calls[0][1]?.signal).toBe(signal);
  });

  it('adds a timeout signal, combined with the caller signal', async () => {
    const controller = new AbortController();

    await requestJson('/api/x', { fallback: 'none', parse, timeoutMs: 50 });
    await requestJson('/api/x', {
      fallback: 'none',
      parse,
      signal: controller.signal,
      timeoutMs: 50,
    });

    const [timeoutOnly, combined] = fetchMock.mock.calls.map(
      ([, init]) => init?.signal,
    );
    expect(timeoutOnly).toBeInstanceOf(AbortSignal);
    expect(combined).not.toBe(controller.signal);

    controller.abort();
    expect(combined?.aborted).toBe(true);
  });

  it('returns the fallback for an error status', async () => {
    respond('parsed', 500);

    await expect(
      requestJson('/api/x', { fallback: 'none', parse }),
    ).resolves.toBe('none');
    expect(parse).not.toHaveBeenCalled();
  });

  it('returns the fallback when the body is not JSON', async () => {
    fetchMock.mockResolvedValue(new Response('<html>', { status: 200 }));

    await expect(
      requestJson('/api/x', { fallback: 'none', parse }),
    ).resolves.toBe('none');
  });

  it('returns the fallback when the request fails', async () => {
    fetchMock.mockRejectedValue(new TypeError('offline'));

    await expect(
      requestJson('/api/x', { fallback: 'none', parse }),
    ).resolves.toBe('none');
  });

  it('returns the fallback when parsing throws', async () => {
    const failing = () => {
      throw new Error('bad shape');
    };

    await expect(
      requestJson('/api/x', { fallback: 'none', parse: failing }),
    ).resolves.toBe('none');
  });
});
