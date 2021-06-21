import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal, Tabs } from 'antd';
import PubCode from './PubCode';
import SaleCode from './SaleCode';

const { TabPane } = Tabs;

const BusinessQrCode = (props) => {
  const { visible, onClose, qrCodeBag } = props;
  const [tabKey, setTabKey] = useState('1');

  const modalProps = {
    title: `店铺二维码 - ${visible.merchantName}`,
    width: 790,
    visible: !!visible,
    afterClose: () => setTabKey('1'),
  };

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

  return (
    <Modal {...modalProps} destroyOnClose onOk={onClose} onCancel={onClose}>
      <Tabs type="card" onChange={setTabKey}>
        <TabPane tab="普通二维码" key="1" forceRender>
          <PubCode visible={visible} changeCanvasToPic={changeCanvasToPic}></PubCode>
        </TabPane>
        <TabPane tab="营销二维码" key="2" forceRender>
          <SaleCode
            tabKey={tabKey}
            qrCodeBag={qrCodeBag}
            merchantName={visible.merchantName}
            changeCanvasToPic={changeCanvasToPic}
          ></SaleCode>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['businessList/fetchMerchantSet'],
}))(BusinessQrCode);
