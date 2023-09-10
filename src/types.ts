import { ReactNode, SetStateAction } from 'react';

import { CompositeLayer, FlyToInterpolator } from '@deck.gl/core/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';

export type LayerName = 'GeoJsonLayer' | 'ClusteredGeoJsonLayer';

export type Layer = GeoJsonLayer | CompositeLayer;

export type Metadata = {
  id: string;
  name: string;
  description: string;
  source: string;
  sourceUrl: string;
  dataUrl: string;
  configDefinition: string;
  classDefinition: LayerName;
  sidebarComponents: string[];
  componentProps: string[];
  mapProps: {
    zoom: number;
    longitude: [number, number];
    latitude: [number, number];
  };
};

export type Feature = {
  properties: { [key: string]: unknown };
  geometry: { coordinates: [number, number] };
};

export type GeoJson = {
  type: string;
  features: Feature[];
};

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

export interface ConfigArgs {
  id: string;
  data: GeoJson;
  updateViewState: UpdateViewState;
}

export type ConfigFactory = (args: ConfigArgs) => { [key: string]: unknown };

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
