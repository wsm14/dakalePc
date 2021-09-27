import React from 'react';

// 回显dom
export default ({ url }) => {
  return <video src={url} style={{ width: '100%' }} autoPlay controls="controls"></video>;
};
