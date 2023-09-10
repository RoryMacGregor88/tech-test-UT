import { useMemo, useState } from 'react';

import { ParentSize } from '@visx/responsive';
import {
  VictoryAxis,
  VictoryBrushContainer,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryZoomContainer,
} from 'victory';

import ChartWrapper from './chart-wrapper.component';

const axisStyles = {
  axis: { fill: 'rgb(255, 255, 255)', stroke: 'rgb(255, 255, 255)' },
  axisLabel: {
    fill: 'rgb(255, 255, 255)',
    padding: 30,
    fontSize: 15,
  },
  tickLabels: { fill: 'rgb(255, 255, 255)', fontSize: 15 },
};

const VictoryExample = ({ apiData, pointCount }) => {
  /** Memoize data to prevent re-calculating between renders */
  const data = useMemo(
    () =>
      apiData
        .map(({ properties }) => ({
          ...properties,
          startTime: new Date(properties.startTime),
        }))
        .sort((a, b) => (a.startTime < b.startTime ? -1 : 1))
        .reduce((acc, cur) => {
          const isDuplicate = !!acc.find(
            (datum) => datum.startTime === cur.startTime,
          );

          return isDuplicate ? acc : [...acc, cur];
        }, []),
    [],
  );

  const defaultZoom = { x: [data[0].startTime, data[2].startTime] };
  const [zoomDomain, setZoomDomain] = useState(defaultZoom);

  const onZoomDomainChange = ({ x }) => setZoomDomain({ x });

  const getXTickFormat = (date: Date) =>
    `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;

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
              label='Date'
              style={axisStyles}
              tickFormat={getXTickFormat}
              tickLabelComponent={<VictoryLabel />}
              tickValues={tickValues}
            />
            <VictoryAxis
              dependentAxis
              label='Count'
              padding={10}
              style={axisStyles}
            />
            <VictoryGroup>
              <VictoryLine
                data={data}
                style={{
                  data: { stroke: 'red' },
                }}
                x='startTime'
                y='count'
              />

              <VictoryScatter
                data={data}
                style={{
                  data: { fill: 'red', stroke: 'red', strokeWidth: 10 },
                }}
                x='startTime'
                y='count'
              />
            </VictoryGroup>
          </VictoryChart>

          <VictoryChart
            containerComponent={
              <VictoryBrushContainer
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
                  data: { stroke: 'red' },
                }}
                x='startTime'
                y='count'
              />

              <VictoryScatter
                data={data}
                style={{
                  data: { fill: 'red', stroke: 'red', strokeWidth: 1 },
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

export default VictoryExample;