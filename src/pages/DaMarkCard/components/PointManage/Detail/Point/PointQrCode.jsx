import React from 'react';
import QRCode from 'qrcode.react';

const PointQrCode = (props) => {
  const { visible = {}, changeCanvasToPic } = props;

  const payUrl = 'https://www.dakale.net?action=pay&enviroment=product&merchantId=';
  const dakaUrl = 'https://www.dakale.net?action=mark&enviroment=product&merchantId=';

  return (
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
  );
};

export default PointQrCode;
