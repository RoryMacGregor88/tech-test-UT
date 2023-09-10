import { ReactNode, createContext, useContext, useState } from 'react';

import { FlyToInterpolator } from '@deck.gl/core/typed';

import { MapContextType, ViewState } from '~/types';

/** Approximate Edinburgh coordinates */
const EDINBURGH_COORDS = { longitude: -3.29, latitude: 55.94 };

const INITIAL_VIEW_STATE = {
  ...EDINBURGH_COORDS,
  zoom: 8,
  pitch: 0,
  bearing: 0,
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator(),
};

const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/dark-v9';

export const MapContext = createContext(undefined);
MapContext.displayName = 'MapContext';

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
  const [mapStyle, setMapStyle] = useState(DEFAULT_MAP_STYLE);

  const updateViewState = (newViewState: Partial<ViewState>) =>
    setViewState((currentViewState) => ({
      ...currentViewState,
      ...newViewState,
    }));

  interface HandleDragArgs {
    viewport: { longitude: number; latitude: number };
  }

  const handleDrag = ({ viewport }: HandleDragArgs) => {
    const { longitude, latitude } = viewport;
    updateViewState({
      longitude,
      latitude,
    });
  };

  const resetViewState = () => setViewState(INITIAL_VIEW_STATE);

  const value = {
    viewState,
    setViewState,
    updateViewState,
    resetViewState,
    handleDrag,
    mapStyle,
    setMapStyle,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

const useMap = (): MapContextType => {
  const context = useContext(MapContext);
  if (context === undefined) throw Error('Wrap your app with <MapProvider />');
  return context;
};

export default useMap;
