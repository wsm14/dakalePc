import React from 'react';

/**
 * 显示dom
 * @param {Array} cell 当前数据
 * @returns
 */
export default ({ cell }) => {
  const { defaultImg, data } = cell;
  // 无数据时展示
  if (!data) return <img src={defaultImg} style={{ width: '100%' }} />;

  return (
    <>
      <image src="" style={{ width: '100%' }}>
        {data[index].name}
      </image>
    </>
  );
};
