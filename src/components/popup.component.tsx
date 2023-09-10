import { Popup as ReactMapGlPopup } from 'react-map-gl';

import TestChart from './test-chart.component';
import VictoryExample from './victory-example';

const Popup = ({ data, setClickedInfo }) => {
  const handleClose = () => setClickedInfo([]);

  const firstFeatureCoords = data[0].geometry.coordinates,
    coords = {
      longitude: firstFeatureCoords[0],
      latitude: firstFeatureCoords[1],
    };
  return (
    <ReactMapGlPopup
      offset={60}
      onClose={handleClose}
      {...coords}
      captureScroll
    >
      <div
        style={{
          maxHeight: '50rem',
          width: '50rem',
          overflowY: 'scroll',
          cursor: 'pointer',
        }}
      >
        <VictoryExample apiData={data} pointCount={data.length} />
      </div>
    </ReactMapGlPopup>
  );
};

export default Popup;
