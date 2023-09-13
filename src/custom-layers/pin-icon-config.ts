import { PickingInfo } from '@deck.gl/core/typed';

import { ACCESSOR_ID } from '~/constants';
import {
  Datum,
  ExtendedPickingInfo,
  SetPickingInfo,
  UpdateViewState,
} from '~/types';

import iconAtlas from './pin-icon-atlas.svg';
import iconMapping from './pin-icon-mapping.json';

interface GeoJsonConfigArgs {
  id: string;
  data: Datum[];
  color: string;
  updateViewState: UpdateViewState;
  setPickingInfo: SetPickingInfo;
}

const geoJsonConfig = ({
  id,
  data,
  color,
  updateViewState,
  setPickingInfo,
}: GeoJsonConfigArgs) => {
  /** Outside layer instance because it calls React state setter */
  const onClusterClick = (zoom: number, coordinate: [number, number]) =>
    updateViewState({
      zoom,
      longitude: coordinate[0],
      latitude: coordinate[1],
    });

  const onIconClick = (info: ExtendedPickingInfo) => setPickingInfo(info);

  return {
    id,
    getIcon: () => `pin-${color}`,
    getGroupIcon: () => `group-${color}`,
    data,
    featureIdAccessor: ACCESSOR_ID,
    selectedFeature: {},
    onClusterClick,
    onIconClick,
    iconAtlas,
    iconMapping,
    pickable: true,
  };
};

export default geoJsonConfig;
