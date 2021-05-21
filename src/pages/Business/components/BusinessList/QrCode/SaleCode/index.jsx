import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import canvasPic from '@/utils/canvasPic';
import bybag from '../img/bybag.jpg';
import paybag from '../img/paybag.jpg';

const SaleCode = ({ tabKey, merchantName, changeCanvasToPic }) => {
  const [imgUrl, setImgUrl] = useState(); // 打卡营销码
  const [payImgUrl, setPayImgUrl] = useState(); // 打卡支付码
  const [loading, setLoading] = useState(false); // 绘制等待

  useEffect(() => {
    if (tabKey === '2') canvasImghan();
  }, [tabKey]);

  const canvasImghan = () => {
    setLoading(true);
    const qrCodePay = document.getElementById('qrCodePay'); // 获取支付码
    const qrCodeDa = document.getElementById('qrCodeDa'); // 获取打卡码
    const merchantNameText =
      merchantName.length > 8
        ? merchantName.replace(merchantName.substring(6, merchantName.length - 6), '**')
        : merchantName;
    canvasPic(
      {
        parts: [
          {
            type: 'image',
            url: paybag,
            width: 1346,
            height: 1890,
          },
          {
            type: 'image',
            url: qrCodePay && qrCodePay.toDataURL('image/png'),
            width: 560,
            height: 560,
            x: 393,
            y: 628,
          },
          {
            type: 'text',
            text: merchantNameText,
            textAlign: 'center',
            y: 1224,
            color: '#000000',
            size: '30px',
            opacity: 0.6,
          },
        ],
        width: 1346,
        height: 1890,
      },
      (err, data) => {
        setPayImgUrl(data);
      },
    );
    canvasPic(
      {
        type: 'url',
        parts: [
          {
            type: 'image',
            url: bybag,
            width: 2480,
            height: 3508,
          },
          {
            type: 'image',
            url: qrCodeDa && qrCodeDa.toDataURL('image/png'),
            width: 700,
            height: 700,
            x: 890,
            y: 1731,
          },
          {
            type: 'text',
            text: merchantNameText,
            textAlign: 'center',
            y: 2527,
            color: '#000000',
            size: '30px',
            opacity: 0.6,
          },
        ],
        width: 2480,
        height: 3508,
      },
      (err, data) => {
        setImgUrl(data);
        setLoading(false);
      },
    );
  };

  return (
    <Spin spinning={loading}>
      <div style={{ display: 'flex', minHeight: 571.72 }}>
        <div style={{ flex: 1 }}>
          {payImgUrl && (
            <>
              <img src={payImgUrl} alt="" style={{ width: '100%' }} />
              <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>支付营销码</div>
              <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
                <a
                  id="down_sale_pay"
                  onClick={() => changeCanvasToPic(payImgUrl, '支付营销码', 'down_sale_pay')}
                >
                  下载
                </a>
              </div>
            </>
          )}
        </div>
        <div style={{ flex: 1, marginLeft: 10 }}>
          {imgUrl && (
            <>
              <img src={imgUrl} alt="" style={{ width: '100%' }} />
              <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>打卡营销码</div>
              <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
                <a
                  id="down_sale_by"
                  onClick={() => changeCanvasToPic(imgUrl, '打卡营销码', 'down_sale_by')}
                >
                  下载
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default SaleCode;
