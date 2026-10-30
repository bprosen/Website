import type { LatLon } from './geo';

export type Visitor = {
  coords: LatLon | null;
  label: string;
  sameCity: boolean;
};
