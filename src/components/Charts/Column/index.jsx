import React from 'react';
import { Column } from '@ant-design/charts';

const ColumnChart = (props) => {
  const {
    height = 0,
    data,
    xyField = { xField: 'type', yField: 'value' },
    meta = { type: { alias: 'x轴' }, value: { alias: 'y轴' } },
    description,
  } = props;
  const config = {
    data,
    forceFit: true,
    height: height,
    radius: 0.8,
    columnSize: 80,
    description: description || false,
    meta,
    ...xyField,
    label: {
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

  return <Column {...config} />;
};

export default ColumnChart;
