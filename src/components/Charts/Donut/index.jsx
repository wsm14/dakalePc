import React from 'react';
import { Donut } from '@ant-design/charts';
import autoHeight from '../autoHeight';

const DonutChart = (props) => {
  const {
    height = 0,
    data,
    description,
    totalLabel,
    angleField = 'value',
    colorField = 'type',
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
    statistic: {
      visible: true,
      triggerOn: false,
      totalLabel: totalLabel || '总计',
    },
    label: {
      visible: true,
      type: 'inner',
      style: { stroke: '', fill: 'white' },
    },
  };

  return <Donut {...config} />;
};

export default autoHeight()(DonutChart);
