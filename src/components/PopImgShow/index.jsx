import React from 'react';
import { Popover } from 'antd';

const PopImgShow = (props) => {
  const { url } = props;

  return (
    <Popover placement="right" content={<img src={url} alt="" style={{ maxWidth: 400 }} />}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 4,
          backgroundImage: `url(${url})`,
          display: 'inline-block',
          backgroundSize: 'cover',
        }}
      ></div>
    </Popover>
  );
};

export default PopImgShow;
