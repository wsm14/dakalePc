import React from 'react';
import { Pie } from '@ant-design/charts';

const PieChart = (props) => {
  const {
    height = 0,
    data,
    description,
    totalLabel,
    angleField = 'value',
    colorField = 'type',
    legend,
    label = {},
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
    autoRotate: true,
    angleField,
    colorField,
    tooltip: {
      visible: true,
      domStyles: {
        'g2-tooltip-value': {
          marginLeft: '15px',
        },
      },
    },
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
      ...label,
    },
    events: {
      onRingClick: (ev) => {
        onClick && onClick(ev);
      }, // 点击事件,其他事件查看文档说明
    },
  };

  return <Pie {...config} />;
};

export default PieChart;
