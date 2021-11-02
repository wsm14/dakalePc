import React from 'react';

/**
 * 显示dom
 * @param {Array} cell 当前数据
 * @returns
 */
export default ({ cell }) => {
  const { defaultImg } = cell;

  // 无数据时展示
  return <img src={defaultImg} style={{ width: '100%' }} />;
};
