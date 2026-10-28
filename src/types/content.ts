import type { BrandName } from '~/constants/brands';

export type Brand = {
  color: string;
  label?: string;
  path: string;
};

export type Stat = {
  label: string;
  value: string;
};

export type MediaSlot = {
  alt?: string;
  focus?: 'center' | 'top';
  label: string;
  src?: string;
  tint?: string;
  video?: string;
};

export type WorkEntry = {
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
