import React from 'react';
import { Modal, Steps } from 'antd';

const GoodsHandleDetail = (props) => {
  const { visible = {}, onClose } = props;

  const { type = '', detail = [] } = visible;

  return (
    <Modal
      title={`操作记录`}
      width={548}
      destroyOnClose
      footer={null}
      visible={type == 'handleDetail'}
      onCancel={onClose}
    >
      <Steps direction="vertical" progressDot current={detail.length}>
        {detail.map((item) => (
          <Steps.Step key={item.identifyIdStr} title={item.createTime} description={item.content} />
        ))}
      </Steps>
    </Modal>
  );
};

export default GoodsHandleDetail;
