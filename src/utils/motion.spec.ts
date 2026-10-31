import { afterEach, describe, expect, it } from 'vitest';
import {
  MOTION_PAUSED_ATTRIBUTE,
  MOTION_PAUSED_VALUE,
  MOTION_STORAGE_KEY,
} from '~/constants';
import { motionInitScript } from './motion';

const runInitScript = () => {
  new Function(motionInitScript())();
  return document.documentElement.hasAttribute(MOTION_PAUSED_ATTRIBUTE);
};

afterEach(() => {
  document.documentElement.removeAttribute(MOTION_PAUSED_ATTRIBUTE);
  localStorage.clear();
});

describe('motionInitScript', () => {
  it('restores paused motion before the first paint', () => {
    localStorage.setItem(MOTION_STORAGE_KEY, MOTION_PAUSED_VALUE);

    expect(runInitScript()).toBe(true);
  });

  it('leaves motion running by default', () => {
    expect(runInitScript()).toBe(false);
  });
});
