import { useState } from 'react';

import { format } from 'date-fns';
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

// import data from './mock-data';

const dataTest = [
  { properties: { startTime: new Date(1982, 1, 1), count: 125 } },
  { properties: { startTime: new Date(1987, 1, 1), count: 257 } },
  { properties: { startTime: new Date(1993, 1, 1), count: 345 } },
  { properties: { startTime: new Date(1997, 1, 1), count: 515 } },
  { properties: { startTime: new Date(2001, 1, 1), count: 132 } },
  { properties: { startTime: new Date(2005, 1, 1), count: 305 } },
  { properties: { startTime: new Date(2011, 1, 1), count: 270 } },
  { properties: { startTime: new Date(2015, 1, 1), count: 470 } },
];

const TestChart = ({ width = 300 }) => {
  const getXTickFormat = (tick: number) => {
    const date = new Date(tick);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  };

  const getYTickFormat = (date: number) => {
    return date;
    // return format(new Date(date), 'yyyy-MM-dd');
  };

  const data = dataTest.map((d) => d.properties);

  //   const transformedData = data.sort().reduce((acc, datum) => {
  //     const { startTime, count, siteID, location, area, provider } =
  //       datum.properties;

  //     const isDuplicate = !!acc.find((d) => d.date === startTime);

  //     if (isDuplicate) return acc;

  //     return [
  //       ...acc,
  //       {
  //         date: startTime,
  //         count,
  //         siteID,
  //         location,
  //         area,
  //         provider,
  //       },
  //     ];
  //   }, []);

  const defaultZoomDomain = [data[0].startTime, data[2].startTime];

  const [zoomDomain, setZoomDomain] = useState({ x: defaultZoomDomain });

  const stroke = '#fff',
    x = 'date',
    y = 'count';

  const onZoomDomainChange = ({ x }) => setZoomDomain({ x });

  return (
    <>
      <div style={{ height: '50vh', backgroundColor: '#808080' }}>
        <VictoryChart
          animate={{
            duration: 500,
            onLoad: { duration: 500 },
          }}
          containerComponent={
            <VictoryZoomContainer
              zoomDimension='x'
              zoomDomain={zoomDomain}
              onZoomDomainChange={onZoomDomainChange}
            />
          }
          domainPadding={{ x: width * 0.1 }}
          height={width / 1.778}
          width={width}
        >
          <VictoryAxis
            tickFormat={getXTickFormat}
            tickLabelComponent={<VictoryLabel angle={90} dx={25} />}
          />
          <VictoryGroup>
            <VictoryGroup>
              <VictoryLine
                data={data}
                style={{ data: { stroke } }}
                x={x}
                y={y}
              />
              <VictoryScatter
                data={data}
                // labelComponent={FlyoutTooltip()}
                // labels={({ datum: { _y } }) => `${_y}`}
                style={{ data: { fill: stroke, stroke } }}
                x={x}
                y={y}
              />
            </VictoryGroup>
          </VictoryGroup>
        </VictoryChart>
      </div>

      <div style={{ height: '50vh', backgroundColor: '#808080' }}>
        <VictoryChart
          containerComponent={
            <VictoryBrushContainer
              brushDimension='x'
              brushDomain={zoomDomain}
              onBrushDomainChange={onZoomDomainChange}
            />
          }
          height={100}
          padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
          width={1000}
        >
          <VictoryAxis
            tickFormat={getXTickFormat}
            tickLabelComponent={<VictoryLabel angle={90} dx={25} />}
          />
          <VictoryLine
            data={data}
            style={{
              data: { stroke: '#fff' },
            }}
            x={x}
            y={y}
          />
        </VictoryChart>
      </div>
    </>
  );
};

export default TestChart;
