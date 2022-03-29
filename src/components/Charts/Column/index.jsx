import React from 'react';
import { Column } from '@ant-design/charts';

const ColumnChart = (props) => {
  const {
    data,
    xyField = { xField: 'type', yField: 'value' },
    meta = { type: { alias: 'x轴' }, value: { alias: 'y轴' } },
    ...other
  } = props;
  const config = {
    padding: 'auto',
    appendPadding: 20,
    data,
    autoFit: true,
    meta,
    ...xyField,
    label: {
      position: 'top', // 'top', 'bottom', 'middle',
    },
    tooltip: {
      visible: true,
      domStyles: {
        'g2-tooltip-value': {
          marginLeft: '15px',
        },
      },
    },
    // colorField: 'type', // 部分图表使用 seriesField
    // color: ['red', 'blue'],
    ...other,
  };

  return <Column {...config} />;
};

export default ColumnChart;
