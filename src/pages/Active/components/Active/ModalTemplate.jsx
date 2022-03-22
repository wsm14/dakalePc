import React from 'react';
import { connect } from 'umi';
import { Modal, Button } from 'antd';
import ActiveTemplate from '../template/ActiveTemplate';

const ModalTemplate = (props) => {
  const { visible, onClose } = props;

  return (
    <Modal width={1000} title="活动模板" footer={false} visible={visible} onCancel={onClose}>
      <ActiveTemplate></ActiveTemplate>
    </Modal>
  );
};
export default ModalTemplate;
