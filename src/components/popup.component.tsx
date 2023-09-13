import { Popup as ReactMapGlPopup } from 'react-map-gl';

import VictoryExample from '~/components/brush-timeseries-chart';
import { GeoJson, SetPickingInfo } from '~/types';

interface Props {
  data: GeoJson;
  setPickingInfo: SetPickingInfo;
}

const Popup = ({ data, setPickingInfo }: Props) => {
  const handleClose = () => setPickingInfo(null);

  const firstFeatureCoords = data[0].geometry.coordinates,
    coords = {
      longitude: firstFeatureCoords[0],
      latitude: firstFeatureCoords[1],
    };
  return (
    <ReactMapGlPopup onClose={handleClose} {...coords} captureScroll>
      <div
        style={{
          maxHeight: '50rem',
          width: '50rem',
          cursor: 'pointer',
        }}
      >
        <VictoryExample apiData={data} pointCount={data.length} />
      </div>
    </ReactMapGlPopup>
  );
};

export default Popup;
