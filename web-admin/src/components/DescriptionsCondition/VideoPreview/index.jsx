import React, { useEffect, useRef } from 'react';

const VideoPreview = ({ url = '' }) => {
  // 空数据直接返回
  if (!url) return '';
  const videoRef = useRef(null);

  useEffect(() => {
    () => {
      videoRef.current.pause();
    };
  }, []);

  // 数据获取
  let fileUrl = url;

  // 返回结果
  return (
    <video
      controls="controls"
      ref={videoRef}
      style={{ maxHeight: 300, margin: '0 auto', width: '100%' }}
      src={fileUrl}
    >
      <track kind="captions" />
    </video>
  );
};

export default VideoPreview;
