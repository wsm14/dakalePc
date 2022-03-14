import React from 'react';
import showImg from '../panel.config';

/**
 * 显示dom
 * @param {Array} moduleName 当前数据名称
 * @returns
 */
export default ({ moduleName }) => {
  const { defaultImg } = showImg[moduleName];

  // 无数据时展示
  return <img src={defaultImg} style={{ width: '100%' }} />;
};
