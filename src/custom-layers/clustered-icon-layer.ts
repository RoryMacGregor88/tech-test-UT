import { CompositeLayer, PickingInfo } from '@deck.gl/core/typed';
import { IconLayer, TextLayer } from '@deck.gl/layers/typed';
import numeral from 'numeral';
import Supercluster from 'supercluster';

import { Datum, Feature } from '~/types';

const DEFAULT_CLUSTER_MAX_ZOOM = 16;
const DEFAULT_CLUSTER_RADIUS = 40;

const DEFAULT_CLUSTER_ICON_NAME = 'cluster';
const DEFAULT_GROUP_ICON_NAME = 'group-red';

const COLOR_PRIMARY = [246, 190, 0, 255];
const SELECTED_CLUSTER_COLOR = [226, 123, 29];

interface ShouldUpdateStateArgs {
  changeFlags: {
    somethingChanged: boolean;
  };
}

class ClusteredIconLayer extends CompositeLayer {
  shouldUpdateState({ changeFlags }: ShouldUpdateStateArgs) {
    return changeFlags.somethingChanged;
  }

  _getDataAsGeoJson(data: Datum[]) {
    return data.map(({ latitude, longitude, ...properties }) => ({
      geometry: { type: 'Point', coordinates: [longitude, latitude] },
      properties,
    }));
  }

  updateState({ props, oldProps, changeFlags }) {
    const { maxZoom, radius } = this.props;

    const shouldRebuildSpatialIndex =
      changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

    if (shouldRebuildSpatialIndex) {
      /** Initialisation of Supercluster spatial index */
      const spatialIndex = new Supercluster({
        maxZoom,
        radius,
      });
      spatialIndex.load(this._getDataAsGeoJson(props.data));
      this.setState({ spatialIndex });
    }

    const integerZoom = Math.floor(this.context.viewport.zoom);
    if (shouldRebuildSpatialIndex || integerZoom !== this.state.z) {
      this.setState({
        data: this.state.spatialIndex.getClusters(
          [-180, -85, 180, 85],
          integerZoom,
        ),
        integerZoom,
      });
    }
  }

  _getPinColor(feature: Feature) {
    if (
      feature.properties.cluster &&
      this._getExpansionZoom(feature) <= this.props.maxZoom
    ) {
      /** Get the points within the cluster */
      const leaves = this.state.spatialIndex.getLeaves(
        feature.properties.cluster_id,
        'Infinity',
      );

      const id = this.props.featureIdAccessor;

      /** Check if the selected item is part of this clustered feature */
      if (this.props.selectedFeature[id]) {
        const isMatch = leaves.find(
          (leaf) => leaf.properties[id] === this.props.selectedFeature[id],
        );
        if (isMatch) {
          return SELECTED_CLUSTER_COLOR;
        }
      }

      return COLOR_PRIMARY;
    }
    if (typeof this.props.getPinColor === 'function') {
      return this.props.getPinColor(feature);
    }
    if (Array.isArray(this.props.pinColor)) {
      return this.props.pinColor;
    }

    if (this.props.selectedFeature) {
      const id = this.props.featureIdAccessor;

      const isSelected =
        this.props.selectedFeature.properties?.[id] === feature.properties[id];

      return isSelected ? [255, 99, 71, 255] : [15, 10, 222, 255];
    }
    return [15, 10, 222, 255];
  }

  _getClusterText(feature: Feature) {
    const { cluster, point_count } = feature.properties;

    const isNotGroup = this._getExpansionZoom(feature) <= this.props.maxZoom;
    if (cluster && isNotGroup) {
      /** Show point count for clusters, but not groups */
      return `${numeral(point_count).format(
        `${point_count > 1000 ? '0.0a' : '0a'}`,
      )}`;
    }
    /** Hide text layer */
    return '';
  }

  _getIcon(feature: Feature) {
    if (feature.properties.cluster) {
      return this._getExpansionZoom(feature) > this.props.maxZoom
        ? this.props.getGroupIcon(feature)
        : this.props.clusterIconName;
    }
    return this.props.getIcon(feature);
  }

  _getIconSize(feature: Feature) {
    if (feature.properties.cluster) {
      return this.props.clusterIconSize;
    }
    return this.props.pinIconSize;
  }

  _getExpansionZoom(feature: Feature) {
    return this.state.spatialIndex.getClusterExpansionZoom(
      feature.properties.cluster_id,
    );
  }

  onClick(info: PickingInfo) {
    const feature: Feature = info.object;
    if (feature.properties.cluster) {
      const isNotGroup = this._getExpansionZoom(feature) <= this.props.maxZoom;
      if (isNotGroup) {
        const expansionZoom = this._getExpansionZoom(feature);
        return this.props.onClusterClick(expansionZoom, info.coordinate);
      }

      const leaves = this.state.spatialIndex.getLeaves(
        feature.properties.cluster_id,
        'Infinity',
      );
      return this.props.onIconClick({ ...info, leaves });
    } else {
      return this.props.onIconClick(info);
    }
  }

  _getPosition(feature: Feature) {
    return feature.geometry.coordinates;
  }

  renderLayers() {
    const { data } = this.state;
    const { iconAtlas, iconMapping, textIconSize, updateTriggers } = this.props;

    /** Background icon for cluster/single pin */
    const iconLayer = new IconLayer(
      this.getSubLayerProps({
        id: 'icon-layer',
        data,
        iconAtlas,
        iconMapping,
        getPosition: (feature: Feature) => this._getPosition(feature),
        getIcon: (feature: Feature) => this._getIcon(feature),
        getSize: (feature: Feature) => this._getIconSize(feature),
        getColor: (feature: Feature) => this._getPinColor(feature),
        updateTriggers: {
          getPosition: updateTriggers.getPosition,
          getIcon: updateTriggers.getIcon,
          getSize: updateTriggers.getIconSize,
          getColor: updateTriggers.getIconColor,
        },
      }),
    );

    /** Number showing amount of leaves in cluster */
    const textLayer = new TextLayer(
      this.getSubLayerProps({
        id: 'text-layer',
        data,
        getPosition: (feature: Feature) => this._getPosition(feature),
        getText: (feature: Feature) => this._getClusterText(feature),
        getSize: () => textIconSize,
        updateTriggers: {
          getPosition: updateTriggers.getPosition,
          getText: updateTriggers.getText,
          getSize: updateTriggers.getTextSize,
          getColor: updateTriggers.getTextColor,
        },
      }),
    );

    return [iconLayer, textLayer];
  }
}

ClusteredIconLayer.layerName = 'ClusteredIconLayer';

ClusteredIconLayer.defaultProps = {
  pickable: true,
  fontFamily: 'Open Sans',
  fontWeight: 600,
  clusterIconName: DEFAULT_CLUSTER_ICON_NAME,
  groupIconName: DEFAULT_GROUP_ICON_NAME,
  maxZoom: DEFAULT_CLUSTER_MAX_ZOOM,
  radius: DEFAULT_CLUSTER_RADIUS,
  textIconSize: 15,
  pinIconSize: 40,
  iconSizeScale: 8,
  clusterIconSize: 40,
  hideTextOnGroup: true,
};

export default ClusteredIconLayer;
