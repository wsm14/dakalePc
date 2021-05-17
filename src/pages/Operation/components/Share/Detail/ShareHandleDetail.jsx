import React from 'react';
import { Modal, Steps } from 'antd';

const ShareHandleDetail = (props) => {
  const { visible = {}, onClose } = props;

  const { show = false, detail = [] } = visible;

  return (
    <Modal
      title={`操作记录`}
      width={548}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
    >
      <Steps direction="vertical" progressDot current={detail.length}>
        {detail.map((item) => (
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

export default ShareHandleDetail;
