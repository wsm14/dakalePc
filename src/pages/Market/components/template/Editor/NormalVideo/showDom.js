import React from 'react';

// 回显dom
export default ({ url, poster }) => {
  return (
    <video
      preload="preload"
      src={url}
      poster={poster}
      style={{
        width: '100%',
        height: 215,
        backgroundImage: `url(${poster})`,
        backgroundPosition: 'center',
      }}
      controls="controls"
    ></video>
  );
};
