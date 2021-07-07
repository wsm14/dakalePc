import React from 'react';
import { message, Modal } from 'antd';

const QrCodeShow = ({ url = null, onCancel, title, data = {} }) => {
  const { specialGoodsId, merchantId } = data;

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
      elink.download = `${title}-商品码.jpg`; // 图片name
      elink.click();
      canvas = null;
    };
  };

  const urlCopy = `pages/perimeter/favourableDetails/index?specialActivityId=${specialGoodsId}&merchantId=${merchantId}`;

  const handleCopy = (e) => {
    const copyDOMs = document.createElement('span');
    copyDOMs.innerHTML = e.target.dataset.url;
    document.body.appendChild(copyDOMs);
    const range = document.createRange();
    window.getSelection().removeAllRanges();
    range.selectNode(copyDOMs);
    window.getSelection().addRange(range);
    const suessUrl = document.execCommand('copy');
    if (suessUrl) {
      message.success('复制成功！');
    }
    document.body.removeChild(copyDOMs);
  };

  // const handleCopy = (e) => {
  //   console.log(e.target.dataset.url);
  //   const range = document.createRange();
  //   window.getSelection().removeAllRanges();
  //   range.selectNodeContents();
  //   range.selectNode(e.target);
  //   window.getSelection().addRange(range);
  //   const suessUrl = document.execCommand('copy');
  // };

  return (
    <Modal title={title} visible={url} onCancel={onCancel} footer={null}>
      <div>
        商品链接：
        <span title={urlCopy}>{urlCopy.slice(0, 50)}...</span>
        <a onClick={handleCopy} data-url={urlCopy}>
          复制
        </a>
      </div>
      <img alt="example" style={{ width: '100%' }} src={url} />
      <div style={{ color: '#868686', textAlign: 'right', marginTop: 5 }}>
        <a onClick={() => changeCanvasToPic()}>下载</a>
      </div>
    </Modal>
  );
};
export default QrCodeShow;
