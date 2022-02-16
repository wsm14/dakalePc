import React from 'react';
import dai from './icon/mreji.png';
import ruzhu from './icon/ruzhu.png';
import mreNo from './icon/mreNo.png';
import './style.less';

/**
 * 地图图例
 */
const MapLegend = ({ mapLengend, setMapLengend }) => {
  const activeImg = (img, num) => (mapLengend === '' || mapLengend === num ? img : mreNo);

  const handleLegend = (num) => {
    const data = mapLengend === num ? '' : num;
    setMapLengend(data);
  };

  // 图例数组
  const lengendArr = [
    {
      label: '已激活', // 3
      key: 3,
      url: activeImg(dai, 3),
      activeClass: mapLengend === 3 || mapLengend === '' ? '' : 'noActive',
      onClick: () => handleLegend(2),
    },
    {
      label: '已入驻',
      url: activeImg(ruzhu, 2),
      key: 2,
      className: 'ruzhuColor',
      activeClass: mapLengend === 2 || mapLengend === '' ? '' : 'noActive',
      onClick: () => handleLegend(3), // 点击只显示已激活
    },
  ];

  return (
    <div className="chart_amap_Legend_right">
      {lengendArr.map((item) => (
        <div
          className={`amap_Legend_item ${item.className || ''} ${item.activeClass}`}
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
