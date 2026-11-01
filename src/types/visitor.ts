import type { LatLon } from './geo';

export type Visitor = {
  coords: LatLon | null;
  label: string;
  sameCity: boolean;
};

export type VisitorLocation = {
  city: string | null;
  coords: LatLon;
};

export type VisitorsSnapshot = {
  dots: LatLon[];
  location: VisitorLocation | null;
};
