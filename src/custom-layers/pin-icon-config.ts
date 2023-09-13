import { ConfigArgs } from '~/types';

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
  /** Outside layer instance because it calls React state setter */
  const onClusterClick = (zoom: number, coordinate: [number, number]) =>
    updateViewState({
      zoom,
      longitude: coordinate[0],
      latitude: coordinate[1],
    });

  const onIconClick = (info) => setClickedInfo(info);

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
