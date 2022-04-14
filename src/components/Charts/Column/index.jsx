import React from 'react';
import { Column } from '@ant-design/charts';
import Loading from '../Loading';
import { each, groupBy } from '@antv/util';

const ColumnChart = (props) => {
  const {
    data,
    xyField = { xField: 'type', yField: 'value' },
    meta = { type: { alias: 'x轴' }, value: { alias: 'y轴' } },
    loading = null,
    ...other
  } = props;

  const annotations = [];
  each(groupBy(data, xyField.xField), (values, k) => {
    const value = values.reduce((a, b) => a + b.value, 0);
    annotations.push({
      type: 'text',
      position: [k, value],
      content: `${value}`,
      style: {
        textAlign: 'center',
        fontSize: 14,
        fill: 'rgba(0,0,0,0.85)',
      },
      offsetY: -10,
    });
  });

  const config = {
    padding: 'auto',
    appendPadding: 20,
    data,
    autoFit: true,
    meta,
    ...xyField,
    // label: {
    //   position: 'top', // 'top', 'bottom', 'middle',
    // },
    tooltip: {
      visible: true,
      domStyles: {
        'g2-tooltip-value': {
          marginLeft: '15px',
        },
      },
    },
    colorField: 'type', // 部分图表使用 seriesField
    color: [
      '#2A8FF7',
      '#5AC35B',
      '#FACD48',
      '#233273',
      '#8545E0',
      '#53C2C3',
      '#3438C7',
      '#ED4764',
      '#F77E00',
      '#B13BB0',
      '#288445',
      '#527C88',
    ],
    annotations,
    ...other,
  };

  return typeof loading === 'boolean' ? (
    <Loading loading={loading}>
      <Column {...config} />
    </Loading>
  ) : (
    <Column {...config} />
  );
};

export default ColumnChart;
