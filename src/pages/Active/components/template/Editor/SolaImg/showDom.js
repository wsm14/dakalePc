import React from 'react';

// 回显dom
export default ({ img, width, height }) => {
  return (
    <img
      src={img}
      style={{ width: width ? width / 2 : '100%', height: height ? height / 2 : 'auto' }}
    ></img>
  );
};
