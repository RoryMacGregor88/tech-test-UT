import Deck from '@deck.gl/react';
import { StaticMap, _MapContext } from 'react-map-gl';

import { Popup } from '~/components';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const Map = ({
  layers,
  viewState,
  mapStyle,
  updateViewState,
  clickedInfo,
  setClickedInfo,
}) => {
  const data = clickedInfo.leaves ?? [clickedInfo.object];
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
      {!!clickedInfo.object ? (
        <Popup data={data} setClickedInfo={setClickedInfo} />
      ) : null}
    </Deck>
  );
};

export default Map;
