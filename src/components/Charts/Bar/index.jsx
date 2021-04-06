import React from 'react';
import Bar from '@ant-design/charts/lib/bar';

const BarChart = (props) => {
  const {
    data,
    xyField = { xField: 'type', yField: 'value' },
    meta = { type: { alias: 'x轴' }, value: { alias: 'y轴' } },
  } = props;
  const config = {
    data,
    ...xyField,
    autoFit: true,
    padding: 'auto',
    appendPadding: 10,
    meta,
    label: {
      position: 'right',
    },
    tooltip: {
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
