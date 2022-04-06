import React from 'react';
import { ChoroplethMap } from '@ant-design/maps';

const ColumnChart = (props) => {
  const {
    data,
    sourceField,
    field,
    viewLevel = {
      level: 'country',
      adcode: 100000,
    },
    ...other
  } = props;
  const config = {
    map: {
      type: 'mapbox',
      style: 'blank',
      center: [120.19382669582967, 30.258134],
      zoom: 3,
      pitch: 0,
    },
    source: {
      data,
      joinBy: {
        sourceField, // 业务数据地理字段
        geoField: 'adcode',
      },
    },
    viewLevel,
    autoFit: true,
    color: {
      field, // 元素颜色值映射关联字段
      value: ['#B8E1FF', '#7DAAFF', '#3D76DD', '#0047A5', '#001D70'],
      scale: {
        type: 'linear',
      },
    },
    style: {
      opacity: 1,
      stroke: '#ccc',
      lineWidth: 0.6,
      lineOpacity: 1,
    },
    label: {
      visible: true,
      field: 'name',
      style: {
        fill: '#000',
        opacity: 0.8,
        fontSize: 10,
        stroke: '#fff',
        strokeWidth: 1.5,
        textAllowOverlap: false,
        padding: [5, 5],
      },
    },
    state: {
      active: {
        stroke: 'black',
        lineWidth: 1,
      },
    },
    zoom: {
      position: 'bottomright',
    },
    legend: {
      position: 'bottomleft',
    },
    ...other,
  };

  return <ChoroplethMap {...config} />;
};

export default ColumnChart;
