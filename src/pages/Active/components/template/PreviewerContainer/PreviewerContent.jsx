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

  if (!editor[editorType]?.dom) return '预览组件未配置';

  console.log(editor[editorType]?.dom(cell.data))

  return editor[editorType]?.dom(cell.data);
};
