export type RequestOptions<T> = {
  body?: unknown;
  fallback: T;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST';
  parse: (body: unknown) => T;
  signal?: AbortSignal;
  timeoutMs?: number;
};

const toSignal = (signal?: AbortSignal, timeoutMs?: number) => {
  const timeout =
    timeoutMs === undefined ? undefined : AbortSignal.timeout(timeoutMs);

  if (signal && timeout) {
    return AbortSignal.any([signal, timeout]);
  }

  return signal ?? timeout;
};

export const requestJson = async <T>(
  url: string,
  {
    body,
    fallback,
    headers,
    method = 'GET',
    parse,
    signal,
    timeoutMs,
  }: RequestOptions<T>,
): Promise<T> => {
  const hasBody = body !== undefined;

  try {
    const response = await fetch(url, {
      body: hasBody ? JSON.stringify(body) : undefined,
      cache: 'no-store',
      headers: hasBody
        ? { 'Content-Type': 'application/json', ...headers }
        : headers,
      method,
      signal: toSignal(signal, timeoutMs),
    });

    return response.ok ? parse(await response.json()) : fallback;
  } catch {
    return fallback;
  }
};
