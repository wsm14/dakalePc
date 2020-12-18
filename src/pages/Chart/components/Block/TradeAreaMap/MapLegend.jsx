import React from 'react';
import dai from './icon/mreji.png';
import ruzhu from './icon/ruzhu.png';
import mreNo from './icon/mreNo.png';
import './style.less';

/**
 * 地图图例
 */
const MapLegend = ({ detail }) => {
  // 图例数组
  const lengendArr = [
    {
      label: '待激活',
      url: dai,
      onClick: () => {},
    },
    {
      label: '已入驻',
      url: ruzhu,
      className: 'ruzhuColor',
      onClick: () => {},
    },
  ];

  return (
    <div className="chart_amap_Legend_right">
      {lengendArr.map((item) => (
        <div
          className={`amap_Legend_item ${item.className || ''}`}
          key={item.label}
          onClick={item.onClick}
        >
          <img src={item.url} className={'amap_Legend_img'}></img> {item.label}
        </div>
      ))}
    </div>
  );
};

export default MapLegend;
