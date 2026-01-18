const { mockHeaders, mockUserAgentFromString } = vi.hoisted(() => ({
  mockHeaders: vi.fn(),
  mockUserAgentFromString: vi.fn(),
}));

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isMobile } from './utils';

vi.mock('next/headers', () => ({
  headers: mockHeaders,
}));

vi.mock('next/server', () => ({
  userAgentFromString: mockUserAgentFromString,
}));

describe('isMobile', () => {
  beforeEach(() => {
    const headers = new Map();
    headers.set('user-agent', '');

    mockHeaders.mockReturnValue(headers);
  });

  it('returns true', async () => {
    const headers = new Map();
    headers.set('user-agent', '');

    mockHeaders.mockReturnValue(headers);
    mockUserAgentFromString.mockReturnValueOnce({ device: { type: 'mobile' } });

    const result = await isMobile();
    expect(result).toEqual(true);
  });

  it('returns false with undefined user agent', async () => {
    mockUserAgentFromString.mockReturnValueOnce(undefined);

    const result = await isMobile();
    expect(result).toEqual(false);
  });
});
