import React from 'react';
import { Pie } from '@ant-design/charts';

const PieChart = (props) => {
  const {
    data,
    totalLabel,
    angleField = 'value',
    colorField = 'type',
    legend,
    statisticShow = true,
    onClick,
    radius = 0.8,
    innerRadius,
  } = props;

  const config = {
    appendPadding: 10,
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
      title: { customHtml: totalLabel || '总计', style: { fontSize: 16 }, offsetY: -10 },
      content: { style: { fontSize: 25 } },
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
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    events: {
      onRingClick: (ev) => {
        onClick && onClick(ev);
      }, // 点击事件,其他事件查看文档说明
    },
  };

  return <Pie {...config} />;
};

export default PieChart;
