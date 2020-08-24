import React from 'react';
import { Column } from '@ant-design/charts';
import autoHeight from '../autoHeight';

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
    radius: 1,
    description: description || false,
    meta,
    ...xyField,
    label: {
      visible: true,
    },
  };

  return <Column {...config} />;
};

export default autoHeight()(ColumnChart);
