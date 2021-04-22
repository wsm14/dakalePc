import React from 'react';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const AuditRefuse = (props) => {
  const { visible, onClose, handleUpData, loading } = props;

  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      handleUpData({ ...values });
    });
  };

  const formItems = [
    {
      label: '驳回原因',
      type: 'textArea',
      name: 'rejectReason',
    },
  ];

  const modalProps = {
    title: `请填写审核驳回的原因`,
    width: 650,
    visible,
    maskClosable: true,
    destroyOnClose: true,
    confirmLoading: loading,
  };

  return (
    <Modal {...modalProps} onCancel={onClose} onOk={handleUpAudit}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </Modal>
  );
};

export default AuditRefuse;
