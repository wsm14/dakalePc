import React from 'react';
import editor from '../Editor';

/**
 * 显示dom
 * @param {Array} cell 当前数据
 * @returns
 */
export default ({ cell }) => {
  const { defaultImg, data, editorType } = cell;

  // 无数据时展示
  if (!data) return <img src={defaultImg} style={{ width: '100%' }} />;

  return <div dangerouslySetInnerHTML={{ __html: editor[editorType]?.dom(cell.data) }}></div>;
};
