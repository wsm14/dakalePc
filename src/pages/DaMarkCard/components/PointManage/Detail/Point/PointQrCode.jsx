import React from 'react';
import QRCode from 'qrcode.react';
import { Modal } from 'antd';

const PointQrCode = (props) => {
  const { visible = {}, onClose } = props;
  const { show = false, detail = {} } = visible;

  const dakaUrl = 'https://www.dakale.net?uniqueKey=';

  console.log(detail.uniqueKey, '11');

  //   点击下载
  const changeCanvasToPic = (id, type, down) => {
    let img = id;
    if (down) {
      const canvasImg = document.getElementById(id); // 获取canvas类型的二维码
      img = canvasImg.toDataURL('image/png'); // 将canvas对象转换为图片的data url
    }
    const elink = document.createElement('a');
    elink.href = img;
    elink.download = `${detail.mainName}-${detail.name}-${type}.jpg`; // 图片name
    elink.click();
  };

  const modalProps = {
    title: `打卡码 - ${detail.name}`,
    width: 500,
    visible: show,
  };
  return (
    <Modal {...modalProps} destroyOnClose onOk={onClose} onCancel={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            color: '#333',
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: 10,
            fontSize: 16,
          }}
        >
          打卡码
        </div>
        <div style={{ border: '1px solid #d2d2d2', padding: 5 }}>
          <QRCode
            id="qrCodeDa"
            value={`${dakaUrl}${detail.uniqueKey}`}
            // value={`${detail.uniqueKey}`}
            size={350} //二维码的宽高尺寸
            fgColor="#000000" //二维码的颜色
          />
          <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
            <a id="down_Da" onClick={() => changeCanvasToPic('qrCodeDa', '打卡码', true)}>
              下载
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PointQrCode;
