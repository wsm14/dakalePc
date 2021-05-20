import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import QRCode from 'qrcode.react';

const BusinessQrCode = (props) => {
  const { visible, onClose } = props;

  const modalProps = {
    title: `店铺二维码 - ${visible.merchantName}`,
    width: 790,
    visible: !!visible,
  };

  const payUrl = 'https://www.dakale.net?action=pay&enviroment=product&merchantId=';
  const dakaUrl = 'https://www.dakale.net?action=mark&enviroment=product&merchantId=';

  const changeCanvasToPic = (id, type, down) => {
    const canvasImg = document.getElementById(id); // 获取canvas类型的二维码
    const img = new Image();
    img.src = canvasImg.toDataURL('image/png'); // 将canvas对象转换为图片的data url
    const downLink = document.getElementById(down);
    downLink.href = img.src;
    downLink.download = `${visible.merchantName}-${type}`; // 图片name
  };

  return (
    <Modal {...modalProps} destroyOnClose onOk={onClose} onCancel={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ border: '1px solid #d2d2d2', padding: 5, width: 360 }}>
          {visible.bankStatus === '3' ? (
            <QRCode
              id="qrCodePay"
              value={`${payUrl}${visible.userMerchantIdString}&timestamp=${new Date().getTime()}`}
              size={350} //二维码的宽高尺寸
              fgColor="#000000" //二维码的颜色
            />
          ) : (
            <div style={{ textAlign: 'center' }}>未激活</div>
          )}
          <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>支付二维码</div>
          <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
            <a
              id="down_link"
              onClick={() => changeCanvasToPic('qrCodePay', '支付码', 'down_link')}
            >
              下载
            </a>
          </div>
        </div>
        <div style={{ border: '1px solid #d2d2d2', padding: 5 }}>
          <QRCode
            id="qrCodeDa"
            value={`${dakaUrl}${visible.userMerchantIdString}&timestamp=${new Date().getTime()}`}
            size={350} //二维码的宽高尺寸
            fgColor="#000000" //二维码的颜色
          />
          <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>打卡二维码</div>
          <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
            <a id="down_Da" onClick={() => changeCanvasToPic('qrCodeDa', '打卡码', 'down_Da')}>
              下载
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['businessList/fetchMerchantSet'],
}))(BusinessQrCode);
