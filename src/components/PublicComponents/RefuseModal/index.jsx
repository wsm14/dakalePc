import React from 'react';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const RefuseModal = (props) => {
  const {
    visible = {},
    onClose,
    handleUpData,
    loading,
    extra = '',
  } = props;
  const { show = false, formProps = {} } = visible;
  const { type = 'refuse', key = 'rejectReason', maxLength = 50 } = formProps;

  const [form] = Form.useForm();

  const showProps = { refuse: '驳回', down: '下架' }[type];

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      handleUpData({ ...values });
    });
  };

  const formItems = [
    {
      label: `${showProps}原因`,
      type: 'textArea',
      name: key,
      maxLength,
      extra,
    },
  ];

  const modalProps = {
    title: `请填写${showProps}的原因`,
    width: 650,
    visible: show,
    maskClosable: true,
    destroyOnClose: true,
    zIndex: 1001,
    confirmLoading: loading,
  };

  return (
    <Modal {...modalProps} onCancel={onClose} onOk={handleUpAudit}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </Modal>
  );
};

export default RefuseModal;
