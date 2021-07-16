import React from 'react';
import { Carousel } from 'antd';

// 回显dom styleIndex 样式序号
export default (value) => {
  const { styleIndex = 0, list = [] } = value;
  return [
    <Carousel autoplay>
      {list.map((item) => (
        <div>
          <img src={item.img} style={{ width: '100%' }}></img>
        </div>
      ))}
    </Carousel>,
  ][styleIndex];
};
