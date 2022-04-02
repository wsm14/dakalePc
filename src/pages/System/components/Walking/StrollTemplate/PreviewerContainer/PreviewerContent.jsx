import React from 'react';
import showImg from '../panel.config';

/**
 * 显示dom
 * @param {Array} moduleName 当前数据名称
 * @returns
 */
export default ({ data = {}, moduleName }) => {
  const { height = 10 } = data; // 占位格获取数据
  const { defaultImg } = showImg[moduleName];

  if (moduleName === 'topBackground') return null;
  if (moduleName === 'spaceOccupyingLattice')
    // 占位格dom预览展示
    return <div style={{ height, backgroundColor: 'transparent' }}></div>;

  // 无数据时展示
  return <img src={defaultImg} style={{ width: '100%' }} />;
};
