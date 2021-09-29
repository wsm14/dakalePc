import React from 'react';

// 回显dom
export default ({ data }) => {
  const { img, width, height, x, y } = data;
  return (
    <img
      src={img}
      style={{
        width: width / 2,
        height: height / 2,
        position: 'absolute',
        top: y / 2,
        left: x / 2,
        zIndex: 10,
      }}
    ></img>
  );
};
