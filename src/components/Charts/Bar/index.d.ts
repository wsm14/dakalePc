import * as React from 'react';
export interface ITimelineChartProps {
  data: Array<{
    type: number;
    value: number;
  }>;
  xyField?: { xField: string; yField: string };
  meta?: { type?: { alias: string }; value?: { alias: string } };
  height?: number;
}

export default class TimelineChart extends React.Component<ITimelineChartProps, any> {}
