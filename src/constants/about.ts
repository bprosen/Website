import type { MediaSlot } from '~/types';

export const ABOUT_BIO: readonly string[] = [
  "I'm a software developer in Winnipeg, and I graduated with distinction in Computer Science from the University of Manitoba. I like building interfaces that feel clean and quick, and I care about testing and tooling as much as the pixels.",
  'Before I wrote software for a living, I spent seven years running a Minecraft server. It taught me how to lead a team and keep things standing.',
];

export const JAPAN_NOTE = '';

export const PHOTOS: readonly MediaSlot[] = [
  { label: 'Photo 1', tint: 'var(--color-accent)' },
  { label: 'Photo 2', tint: 'var(--color-tint-stone)' },
  { label: 'Photo 3', tint: 'var(--color-tint-leaf)' },
  { label: 'Photo 4', tint: 'var(--color-tint-sand)' },
  { label: 'Photo 5', tint: 'var(--color-tint-stone)' },
  { label: 'Photo 6', tint: 'var(--color-accent)' },
];
