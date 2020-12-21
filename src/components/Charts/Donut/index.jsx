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
    innerRadius,
    legend,
    label = {},
    labelColor = 'white',
    statisticShow = true,
    onClick,
    radius = 0.8,
  } = props;

  const config = {
    data,
    forceFit: true,
    height: height,
    radius,
    description: description || false,
    angleField,
    colorField,
    tooltip: true,
    innerRadius,
    statistic: {
      visible: statisticShow,
      triggerOn: false,
      totalLabel: totalLabel || '总计',
    },
    padding: 'auto',
    legend,
    label: {
      visible: true,
      type: 'inner',
      style: { stroke: '', fill: labelColor },
      ...label,
    },
    events: {
      onRingClick: (ev) => {
        onClick && onClick(ev);
      }, // 点击事件,其他事件查看文档说明
    },
  };

  return <Donut {...config} />;
};

export default DonutChart;
