import React from 'react';
import './style.less';

/**
 * 地图图例
 */
const MapLegend = ({ detail }) => {

  // 图例数组
  const lengendArr = [
    {
      label: '已激活',
      url: '',
      onClick: () => {},
    },
    {
      label: '已入驻',
      url: '',
      onClick: () => {},
    },
  ];

  return (
    <div className="chart_amap_Legend_right">
      {lengendArr.map((item) => (
        <div className="amap_Legend_item" key={item.label} onClick={item.onClick}>
          <img src={item.url} className="amap_Legend_img"></img> {item.label}
        </div>
      ))}
    </div>
  );
};

export default MapLegend;
