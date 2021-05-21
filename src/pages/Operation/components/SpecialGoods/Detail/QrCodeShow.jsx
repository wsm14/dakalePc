import React from 'react';
import { Modal } from 'antd';

const QrCodeShow = ({ url = null, onCancel, title }) => {
  const changeCanvasToPic = (type, down) => {
    const canvas = document.createElement('canvas'); //创建canvas DOM元素
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const dataURL = canvas.toDataURL('image/png');
      const downLink = document.getElementById(down);
      downLink.href = dataURL;
      downLink.download = `${title}-${type}`; // 图片name
      canvas = null;
    };
  };

  return (
    <Modal title={title} visible={url} onCancel={onCancel} footer={null}>
      <img alt="example" style={{ width: '100%' }} src={url} />
      {/* <div style={{ color: '#868686', textAlign: 'right', marginTop: 5 }}>
        <a id="down_link" onClick={() => changeCanvasToPic('商品码', 'down_link')}>
          下载
        </a>
      </div> */}
    </Modal>
  );
};
export default QrCodeShow;
