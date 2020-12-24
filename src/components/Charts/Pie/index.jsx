import React from 'react';
import { Pie } from '@ant-design/charts';

const PieChart = (props) => {
  const {
    data,
    totalLabel,
    angleField = 'value',
    colorField = 'type',
    legend,
    label = {},
    statisticShow = true,
    onClick,
    radius = 1,
    innerRadius,
  } = props;

  const config = {
    data,
    radius,
    autoRotate: true,
    angleField,
    colorField,
    innerRadius,
    tooltip: {
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
    legend: {
      layout: 'horizontal',
      position: 'right',
      flipPage: false,
      ...legend,
    },
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
      },
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
