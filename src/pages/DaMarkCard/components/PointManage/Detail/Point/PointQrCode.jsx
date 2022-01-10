import React from 'react';
import QRCode from 'qrcode.react';
import { Modal } from 'antd';

const PointQrCode = (props) => {
  const { visible = {}, changeCanvasToPic, onClose } = props;

  const dakaUrl = 'https://www.dakale.net?uniqueKey=';

  //   点击下载
  const changeCanvasToPic = (id, type, down) => {
    let img = id;
    if (down) {
      const canvasImg = document.getElementById(id); // 获取canvas类型的二维码
      img = canvasImg.toDataURL('image/png'); // 将canvas对象转换为图片的data url
    }
    const elink = document.createElement('a');
    elink.href = img;
    elink.download = `${visible.merchantName}-${type}.jpg`; // 图片name
    elink.click();
  };

  const modalProps = {
    title: `店铺二维码 - ${visible.merchantName}`,
    width: 790,
    visible: !!visible,
    afterClose: () => setTabKey('1'),
  };
  return (
    <Modal {...modalProps} destroyOnClose onOk={onClose} onCancel={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ border: '1px solid #d2d2d2', padding: 5 }}>
          <QRCode
            id="qrCodeDa"
            value={`${dakaUrl}${visible.userMerchantIdString}&timestamp=${new Date().getTime()}`}
            size={350} //二维码的宽高尺寸
            fgColor="#000000" //二维码的颜色
          />
          <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>打卡二维码</div>
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
