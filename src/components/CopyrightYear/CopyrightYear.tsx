'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const currentYear = () => new Date().getFullYear();

export const CopyrightYear = () =>
  useSyncExternalStore(subscribe, currentYear, currentYear);
