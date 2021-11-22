import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal, Steps } from 'antd';

/**
 * 订单退款
 */
const OrderJournal = (props) => {
  const { visible = {}, onClose, getDetail, dispatch, loading } = props;
  const { show = false, detail = [] } = visible;

  const modalProps = {
    title: `日志`,
    width: 500,
    visible: show,
    maskClosable: true,
    destroyOnClose: true,
    zIndex: 1001,
    confirmLoading: loading,
    bodyStyle: { overflowY: 'auto', maxHeight: 600 },
  };

  return (
    <Modal {...modalProps} onCancel={onClose}>
      <Steps direction="vertical" progressDot current={detail.length}>
        {detail.map((item) => (
          <Steps.Step
            key={item.identificationIdStr}
            title={item.createTime}
            description={<span style={{ whiteSpace: 'pre-line' }}>{item.actionDesc}</span>}
          />
        ))}
      </Steps>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['ordersList/fetchOrdersListActionLog'],
}))(OrderJournal);
