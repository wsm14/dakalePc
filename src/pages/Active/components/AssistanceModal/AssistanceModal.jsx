import React from 'react';
import { Modal, Button } from 'antd';

function AssistanceModal(props) {
  const { ...rest } = props;
  return (
    <Modal {...rest}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}

export default AssistanceModal;
