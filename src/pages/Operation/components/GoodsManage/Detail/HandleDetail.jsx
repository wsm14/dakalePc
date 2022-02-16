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
        {type == 'handleDetail' &&
          detail.map((item) => (
            <Steps.Step
              key={item.identifyIdStr}
              title={item.createTime}
              description={
                <span style={{ whiteSpace: 'pre-line' }}>
                  {item.content}
                  <div>操作人：{item.operator}</div>
                </span>
              }
            />
          ))}
      </Steps>
    </Modal>
  );
};

export default GoodsHandleDetail;
