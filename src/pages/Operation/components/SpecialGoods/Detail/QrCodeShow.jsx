import React from 'react';
import { Modal } from 'antd';

const QrCodeShow = ({ url = null, onCancel, title }) => {
  const changeCanvasToPic = () => {
    let canvas = document.createElement('canvas'); //创建canvas DOM元素
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const dataURL = canvas.toDataURL('image/png');
      const elink = document.createElement('a');
      elink.href = dataURL;
      elink.download = `${title}-商品码`; // 图片name
      elink.click();
      canvas = null;
    };
  };

  return (
    <Modal title={title} visible={url} onCancel={onCancel} footer={null}>
      <img alt="example" style={{ width: '100%' }} src={url} />
      <div style={{ color: '#868686', textAlign: 'right', marginTop: 5 }}>
        <a onClick={() => changeCanvasToPic()}>下载</a>
      </div>
    </Modal>
  );
};
export default QrCodeShow;
