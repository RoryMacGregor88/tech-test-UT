import { CompositeLayer } from '@deck.gl/core/typed';
import Deck from '@deck.gl/react';
import { StaticMap, _MapContext } from 'react-map-gl';

import { Popup } from '~/components';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  ExtendedPickingInfo,
  SetPickingInfo,
  UpdateViewState,
  ViewState,
} from '~/types';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Props {
  layers: CompositeLayer[];
  viewState: ViewState;
  mapStyle: string;
  updateViewState: UpdateViewState;
  pickingInfo: ExtendedPickingInfo | null;
  setPickingInfo: SetPickingInfo;
}

const Map = ({
  layers,
  viewState,
  mapStyle,
  updateViewState,
  pickingInfo,
  setPickingInfo,
}: Props) => {
  const data = pickingInfo?.leaves ?? [pickingInfo?.object];
  return (
    <Deck
      ContextProvider={_MapContext.Provider}
      controller={true}
      initialViewState={viewState}
      layers={layers}
      onMove={updateViewState}
    >
      <StaticMap
        mapStyle={mapStyle}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      />
      {!!pickingInfo?.object ? (
        <Popup data={data} setPickingInfo={setPickingInfo} />
      ) : null}
    </Deck>
  );
};

export default Map;
