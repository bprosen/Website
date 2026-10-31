import { renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { stubMediaQueries } from '~/lib/testing';
import { useMediaQuery } from './useMediaQuery';

const QUERY = '(min-width: 40rem)';

const ServerProbe = () => String(useMediaQuery(QUERY, true));

describe('useMediaQuery', () => {
  it('reports whether the query matches', () => {
    stubMediaQueries((query) => query === QUERY);

    expect(renderHook(() => useMediaQuery(QUERY, false)).result.current).toBe(
      true,
    );
  });

  it('uses the server value when rendering on the server', () => {
    expect(renderToString(createElement(ServerProbe))).toBe('true');
  });
});
