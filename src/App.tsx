import { useEffect, useState } from 'react';

import { CompositeLayer } from '@deck.gl/core/typed';

import { Map } from '~/components';
import pinIconConfigFn from '~/custom-layers/pin-icon-config';
import { useMap } from '~/hooks';
import { Datum, ExtendedPickingInfo } from '~/types';

import ClusteredIconLayer from './custom-layers/clustered-icon-layer';

const COLORS = ['red', 'purple', 'green'];

const baseUrl =
    'https://api.usmart.io/org/d1b773fa-d2bd-4830-b399-ecfd18e832f3',
  glasgow = '657f6f93-932b-4851-ae21-830b321c185d/latest/urql',
  edinburgh = '4709d578-f2b6-4584-b8e2-4512c5936f65/latest/urql',
  stirling = '7aa487cd-3cd5-405b-850e-1e2ac317816c/latest/urql';

const urls = [
  `${baseUrl}/${glasgow}`,
  `${baseUrl}/${edinburgh}`,
  `${baseUrl}/${stirling}`,
];

const App = () => {
  const { viewState, updateViewState, mapStyle } = useMap();

  const [layers, setLayers] = useState<CompositeLayer[]>([]);
  const [pickingInfo, setPickingInfo] = useState<ExtendedPickingInfo | null>(
    null,
  );

  useEffect(() => {
    /** Immediate function that will run as soon as it is defined */
    (async () => {
      const promises = urls.map((url) => fetch(url));

      const dataArray = (await Promise.all(promises).then((results) =>
        results.map((result) => result.json()),
      )) as Datum[][];

      const layerInstances = dataArray.map((data, i) => {
        const config = pinIconConfigFn({
          id: `cluster-${i + 1}`,
          color: COLORS[i],
          data,
          updateViewState,
          setPickingInfo,
        });

        return new ClusteredIconLayer(config);
      });

      setLayers(layerInstances);
    })();
  }, [updateViewState]);

  return (
    <Map
      layers={layers}
      mapStyle={mapStyle}
      pickingInfo={pickingInfo}
      setPickingInfo={setPickingInfo}
      updateViewState={updateViewState}
      viewState={viewState}
    />
  );
};

export default App;
