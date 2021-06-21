import React from 'react';
import { connect } from 'umi';
import { Button, Upload, Alert } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';

const BusinessQrCodeBag = (props) => {
  const { visible = {}, onOk } = props;

  const { show = false, payBag = undefined, saleBag = undefined } = visible;

  const handleOkUpload = (value, fileData) => {
    const { file } = fileData;
    const { status } = file;
    if (status === 'removed') {
      onOk({ ...visible, [value]: [], [`${value}url`]: '' });
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const dataURL = e.target.result;
      onOk({ ...visible, [value]: fileData.fileList, [`${value}url`]: dataURL });
    };
    fileReader.readAsDataURL(file);
    return;
  };

  const modalProps = {
    title: `设置二维码背景图片`,
    width: 560,
    visible: show,
    closeLabel: '关闭',
    onClose: () => onOk({ ...visible, show: false }),
  };

  const uploadProps = {
    listType: 'picture',
    maxCount: 1,
    accept: 'image/*',
    beforeUpload: () => false,
  };

  return (
    <DrawerCondition {...modalProps}>
      <Alert message="仅本地使用" type="success"></Alert>
      <Upload
        fileList={payBag}
        {...uploadProps}
        onChange={(file) => handleOkUpload('payBag', file)}
      >
        <Button style={{ marginTop: 5 }}>选择支付码背景片</Button>
      </Upload>
      <Upload
        fileList={saleBag}
        {...uploadProps}
        onChange={(file) => handleOkUpload('saleBag', file)}
      >
        <Button style={{ marginTop: 5 }}>选择打卡码背景片</Button>
      </Upload>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['businessList/fetchMerchantSet'],
}))(BusinessQrCodeBag);
