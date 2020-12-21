import React from 'react';
import { Bar } from '@ant-design/charts';

const BarChart = (props) => {
  const {
    height = 0,
    data,
    xyField = { xField: 'type', yField: 'value' },
    meta = { type: { alias: 'x轴' }, value: { alias: 'y轴' } },
  } = props;
  const config = {
    data,
    ...xyField,
    forceFit: true,
    height: height,
    meta,
    label: {
      position: 'right',
      visible: true,
    },
    tooltip: {
      visible: true,
      domStyles: {
        'g2-tooltip-value': {
          marginLeft: '15px',
        },
      },
    },
  };

  return <Bar {...config} />;
};

export default BarChart;
