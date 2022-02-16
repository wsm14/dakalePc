import React from 'react';

const VideoPreview = ({ url = '' }) => {
  // 空数据直接返回
  if (!url) return '';

  // 返回结果
  return url.split(',').map((item) => (
    <div key={item}>
      <a href={item}>{item} </a>
    </div>
  ));
};

export default VideoPreview;
