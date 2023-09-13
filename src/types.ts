import { Dispatch, ReactNode, SetStateAction } from 'react';

import { FlyToInterpolator, PickingInfo } from '@deck.gl/core/typed';

export type LayerName = 'GeoJsonLayer' | 'ClusteredGeoJsonLayer';

export type Datum = {
  provider: string;
  area: string;
  siteID: string;
  location: string;
  latitude: number;
  longitude: number;
  startTime: string;
  endTime: string;
  count: number;
  usmart_id: string;
};

export type GeoJson = {
  type: string;
  geometry: { coordinates: [number, number] };
  properties: Datum;
}[];

export type ExtendedPickingInfo = PickingInfo & { leaves: Datum[] };

export type SetPickingInfo = Dispatch<
  SetStateAction<ExtendedPickingInfo | null>
>;

export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration: number;
  transitionInterpolator: FlyToInterpolator;
}

export type UpdateViewState = (newViewState: Partial<ViewState>) => void;

export interface MapContextType {
  viewState: ViewState;
  setViewState: SetStateAction<ViewState>;
  updateViewState: UpdateViewState;
  resetViewState: () => void;
  mapStyle: string;
  setMapStyle: SetStateAction<string>;
}

export type SidebarComponent = ReactNode;
