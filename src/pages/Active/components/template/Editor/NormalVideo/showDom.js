import React from 'react';

// 回显dom
export default ({ url }) => {
  return <video preload="preload" src={url} style={{ width: '100%' }} controls="controls"></video>;
};
