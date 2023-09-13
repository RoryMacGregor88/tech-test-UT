import { useMemo, useState } from 'react';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import {
  VictoryAxis,
  VictoryBrushContainer,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryZoomContainer,
} from 'victory';

import ChartWrapper from '~/components/chart-wrapper.component';
import { Datum, GeoJson } from '~/types';

const axisStyles = {
  axis: { fill: 'rgb(255, 255, 255)', stroke: 'rgb(255, 255, 255)' },
  axisLabel: {
    fill: 'rgb(255, 255, 255)',
    padding: 30,
    fontSize: 15,
  },
  tickLabels: { fill: 'rgb(255, 255, 255)', fontSize: 15 },
};

interface TransformedDatum extends Omit<Datum, 'startTime'> {
  startTime: Date;
}

interface Props {
  timeseriesData: GeoJson;
  pointCount: number;
}

const BrushTimeseriesChart = ({ timeseriesData, pointCount }: Props) => {
  /** Cache data to prevent re-calculating between renders */
  const data = useMemo(
    () =>
      timeseriesData
        .map(
          ({ properties }): TransformedDatum => ({
            ...properties,
            startTime: new Date(properties.startTime),
          }),
        )
        .sort((a, b) => (a.startTime < b.startTime ? -1 : 1))
        .reduce((acc: TransformedDatum[], cur) => {
          const isDuplicate = !!acc.find(
            (datum) => datum.startTime === cur.startTime,
          );

          return isDuplicate ? acc : [...acc, cur];
        }, []),
    [],
  );

  const defaultZoom = { x: [data[0].startTime, data[4].startTime] };
  const [zoomDomain, setZoomDomain] = useState(defaultZoom);

  const onZoomDomainChange = ({ x }: { x }) => setZoomDomain({ x });

  const getXTickFormat = (date: Date) =>
    `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const getYTickFormat = (tick: number) => {
    const format = `${tick > 1000 ? '0.0 a' : '0 a'}`;
    const result = numeral(tick).format(format);
    return isNaN(Number(result)) ? '' : result;
  };

  const tickValues = data.map(({ startTime }) => startTime);

  return (
    <ParentSize>
      {({ width }) => (
        <ChartWrapper
          description={`A real-time daily upload from each cycling counter within Glasgow/Edinburgh/Stirling Council networks.`}
          pointCount={pointCount}
          title='Daily cycling counts'
        >
          <VictoryChart
            containerComponent={
              <VictoryZoomContainer
                zoomDimension='x'
                zoomDomain={zoomDomain}
                onZoomDomainChange={onZoomDomainChange}
              />
            }
            width={width}
          >
            <VictoryAxis
              fixLabelOverlap={false}
              label='Date'
              style={axisStyles}
              tickFormat={getXTickFormat}
              tickValues={tickValues}
            />
            <VictoryAxis
              dependentAxis
              label='Count'
              padding={10}
              style={axisStyles}
              tickFormat={getYTickFormat}
              tickLabelComponent={<VictoryLabel dx={7.5} />}
            />
            <VictoryGroup>
              <VictoryLine
                data={data}
                style={{
                  data: { stroke: 'tomato' },
                }}
                x='startTime'
                y='count'
              />

              <VictoryScatter
                data={data}
                labelComponent={
                  <VictoryTooltip
                    constrainToVisibleArea
                    flyoutHeight={40}
                    flyoutWidth={100}
                    pointerOrientation='right'
                    pointerWidth={25}
                    style={{ fill: '#000' }}
                  />
                }
                labels={({ datum: { _y } }) => `Count: ${_y}`}
                style={{
                  data: { fill: 'tomato', stroke: 'tomato', strokeWidth: 10 },
                }}
                x='startTime'
                y='count'
              />
            </VictoryGroup>
          </VictoryChart>

          <VictoryChart
            containerComponent={
              <VictoryBrushContainer
                allowResize={false}
                brushDimension='x'
                brushDomain={zoomDomain}
                brushStyle={{
                  stroke: 'transparent',
                  fill: '#fff',
                  fillOpacity: 0.5,
                }}
                onBrushDomainChange={onZoomDomainChange}
              />
            }
            height={width / 10}
            padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
            width={width}
          >
            <VictoryAxis style={axisStyles} tickFormat={() => {}} />
            <VictoryAxis
              dependentAxis
              style={axisStyles}
              tickFormat={() => {}}
            />
            <VictoryGroup>
              <VictoryLine
                data={data}
                style={{
                  data: { stroke: 'tomato' },
                }}
                x='startTime'
                y='count'
              />

              <VictoryScatter
                data={data}
                style={{
                  data: { fill: 'tomato', stroke: 'tomato', strokeWidth: 1 },
                }}
                x='startTime'
                y='count'
              />
            </VictoryGroup>
          </VictoryChart>
        </ChartWrapper>
      )}
    </ParentSize>
  );
};

export default BrushTimeseriesChart;
