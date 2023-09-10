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
        <Popup
          // selectedFeatures={selectedFeatures}
          data={data}
          setClickedInfo={setClickedInfo}
          // setSelectedFeatures={setSelectedFeatures}
        />
      ) : null}
      {/* {clickedInfo.object ? (
        <div
          style={{
            position: 'absolute',
            zIndex: 1000,
            pointerEvents: 'none',
            left: clickedInfo.x,
            top: clickedInfo.y,
          }}
        >
          {clickedInfo.object.message ?? 'HELLO THERE'}
          <button
            onClick={() => {
              console.log('CLICKED!!!');
            }}
          >
            CLICK
          </button>
        </div>
      ) : null} */}
    </Deck>
  );
};

export default Map;
