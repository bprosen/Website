import type { BrandName } from '~/constants';

export type Brand = {
  color: string;
  label?: string;
  path: string;
  url: string;
  viewBox?: string;
};

export type Stat = {
  label: string;
  value: string;
};

export type MediaFile = {
  height: number;
  src: string;
  video?: string;
  width: number;
};

type NoMediaFile = {
  height?: never;
  src?: never;
  video?: never;
  width?: never;
};

export type LightboxItem = MediaFile & {
  alt: string;
  tint?: string;
};

export type MediaSlot = {
  alt?: string;
  focus?: 'center' | 'top';
  label: string;
  tint?: string;
} & (MediaFile | NoMediaFile);

export type Job = {
  collage?: readonly MediaSlot[];
  company: string;
  id: string;
  link?: Link;
  period: string;
  role: string;
  roleNote: string;
  stats?: readonly Stat[];
  summary: string;
  tech: readonly BrandName[];
};

export type Link = {
  href: string;
  label: string;
};

export type Section = {
  label: string;
  slug: string;
};
