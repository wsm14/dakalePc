import React from 'react';
import { Popover } from 'antd';

const PopImgShow = (props) => {
  const { url } = props;

  return (
    <>
      {/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url) ? (
        <Popover placement="right" content={<img src={url} alt="" style={{ maxWidth: 400 }} />}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 4,
              backgroundImage: `url(${url})`,
              display: 'inline-block',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </Popover>
      ) : (
        '--'
      )}
    </>
  );
};

export default PopImgShow;
