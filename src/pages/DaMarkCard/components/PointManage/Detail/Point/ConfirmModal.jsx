import React from 'react';
import { Modal } from 'antd';
const ConfirmModal = ({ visible, handleOk, onClose }) => {
  return (
    <Modal visible={visible} onOk={handleOk} onCancel={onClose}>
      <p>停用后主体下所有点位也将停止使用，确定停用吗？</p>
    </Modal>
  );
};
export default ConfirmModal;
