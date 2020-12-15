import React from 'react';
import { Donut } from '@ant-design/charts';

const DonutChart = (props) => {
  const {
    height = 0,
    data,
    description,
    totalLabel,
    angleField = 'value',
    colorField = 'type',
    barWidthRatio = 0.8,
    innerRadius,
    legend,
    label = {},
    labelColor = 'white',
    statisticShow = true,
  } = props;

  const config = {
    data,
    forceFit: true,
    height: height,
    radius: 1,
    description: description || false,
    angleField,
    colorField,
    tooltip: true,
    barWidthRatio,
    innerRadius,
    statistic: {
      visible: statisticShow,
      triggerOn: false,
      totalLabel: totalLabel || '总计',
    },
    legend,
    label: {
      visible: true,
      type: 'inner',
      style: { stroke: '', fill: labelColor },
      ...label,
    },
  };

  return <Donut {...config} />;
};

export default DonutChart;
