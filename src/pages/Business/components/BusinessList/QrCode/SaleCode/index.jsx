import React, { useEffect, useState } from 'react';
import { Spin, Upload, Button } from 'antd';
import canvasPic from '@/utils/canvasPic';

const SaleCode = ({ tabKey, merchantName, changeCanvasToPic }) => {
  const [imgUrl, setImgUrl] = useState(); // 打卡营销码
  const [payImgUrl, setPayImgUrl] = useState(); // 打卡支付码
  const [loading, setLoading] = useState(false); // 绘制等待
  const [bagUpload, setBagUpload] = useState({ pay: null, by: null }); // 绘制等待

  useEffect(() => {
    if (tabKey === '2') canvasImghan({ pay: bagUpload.pay, by: bagUpload.by });
  }, [tabKey, bagUpload]);

  const canvasImghan = ({ pay, by }) => {
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
            url: pay || 'https://resource-new.dakale.net/admin/QrCode/paybag.png',
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
            url: by || 'https://resource-new.dakale.net/admin/QrCode/bybag.png',
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

  const handleImgChange = (type, file) => {
    const { status } = file;
    if (status === 'removed') {
      setBagUpload((old) => ({ ...old, [type]: undefined }));
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const dataURL = e.target.result;
      setBagUpload((old) => ({ ...old, [type]: dataURL }));
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <Spin spinning={loading}>
      <div style={{ display: 'flex', minHeight: 571.72 }}>
        <div style={{ flex: 1 }}>
          {payImgUrl && (
            <>
              <img src={payImgUrl} alt="" style={{ width: '100%' }} />
              <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
                支付营销码 <a onClick={() => changeCanvasToPic(payImgUrl, '支付营销码')}>下载</a>
              </div>
              <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
                <Upload
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={(file) => handleImgChange('pay', file.file)}
                >
                  <Button>上传背景图片</Button>
                </Upload>
              </div>
            </>
          )}
        </div>
        <div style={{ flex: 1, marginLeft: 10 }}>
          {imgUrl && (
            <>
              <img src={imgUrl} alt="" style={{ width: '100%' }} />
              <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
                打卡营销码 <a onClick={() => changeCanvasToPic(imgUrl, '打卡营销码')}>下载</a>
              </div>
              <div style={{ color: '#868686', textAlign: 'center', marginTop: 5 }}>
                <Upload
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={(file) => handleImgChange('by', file.file)}
                >
                  <Button>上传背景图片</Button>
                </Upload>
              </div>
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default SaleCode;
