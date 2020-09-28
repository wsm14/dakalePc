import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import QRCode from 'qrcode.react';

const BusinessQrCode = (props) => {
  const { visible, onClose } = props;

  const modalProps = {
    title: `商户二维码 - ${visible.merchantName}`,
    width: 1080,
    visible: !!visible,
  };

  const payUrl = 'https://www.dakale.net?action=pay&enviroment=product&merchantId=';
  const dakaUrl = 'https://www.dakale.net?action=mark&enviroment=product&merchantId=';

  return (
    <Modal {...modalProps} destroyOnClose onOk={onClose} onCancel={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ border: '1px solid #d2d2d2', padding: 5 }}>
          <QRCode
            value={`${payUrl}${visible.userMerchantIdString}&timestamp=${new Date().getTime()}`}
            size={500} //二维码的宽高尺寸
            fgColor="#000000" //二维码的颜色
          />
          <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>支付二维码</div>
        </div>
        <div style={{ border: '1px solid #d2d2d2', padding: 5 }}>
          <QRCode
            value={`${dakaUrl}${visible.userMerchantIdString}&timestamp=${new Date().getTime()}`}
            size={500} //二维码的宽高尺寸
            fgColor="#000000" //二维码的颜色
          />
          <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>打卡二维码</div>
        </div>
      </div>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['businessList/fetchMerchantSet'],
}))(BusinessQrCode);
