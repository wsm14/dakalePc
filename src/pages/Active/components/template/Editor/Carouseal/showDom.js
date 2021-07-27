import React from 'react';
import { Carousel } from 'antd';

// 回显dom 样式序号
export default (value) => {
  const { list = [] } = value;
  return (
    <Carousel autoplay>
      {list.map((item) => (
        <div key={item.img}>
          <img src={item.img} style={{ width: '100%' }}></img>
        </div>
      ))}
    </Carousel>
  );
};
