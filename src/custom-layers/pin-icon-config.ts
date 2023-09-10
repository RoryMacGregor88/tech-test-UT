import { ConfigArgs, Feature } from '~/types';

import iconAtlas from './pin-icon-atlas.svg';
import iconMapping from './pin-icon-mapping.json';

const featureIdAccessor = 'usmart_id';

const geoJsonConfig = ({
  id,
  data,
  color,
  updateViewState,
  setClickedInfo,
}: ConfigArgs) => {
  // const onFeatureClick = (feature: Feature) => {
  //   setSelectedFeatures([feature]);
  // };

  const onIconClick = (info) => {
    setClickedInfo(info);
  };

  /** Must be outside because calls react state setter */
  const onClusterClick = (zoom: number) => {
    // TODO: also add coordinates here so it flies to clicked cluster
    updateViewState({ zoom });
  };

  return {
    id,
    getIcon: () => `pin-${color}`,
    getGroupIcon: () => `group-${color}`,
    data,
    featureIdAccessor,
    selectedFeature: {},
    onClusterClick,
    onIconClick,
    iconAtlas,
    iconMapping,
    pickable: true,
  };
};

export default geoJsonConfig;
