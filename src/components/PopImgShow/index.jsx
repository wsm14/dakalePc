import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';

/**
 * 图片展示组件
 * @param {图片路径} url
 */
const PopImgShow = ({ url, onClick }) => {
  PopImgShow.propTypes = {
    url: PropTypes.string.isRequired,
  };

  const imgDiv = (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        width: 80,
        height: 80,
        borderRadius: 4,
        backgroundImage: `url(${url})`,
        display: 'inline-block',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    ></div>
  );

  return (
    <>
      {onClick ? (
        imgDiv
      ) : url ? (
        <Popover placement="right" content={<img src={url} alt="" style={{ maxWidth: 400 }} />}>
          {imgDiv}
        </Popover>
      ) : (
        ''
      )}
    </>
  );
};

export default PopImgShow;
