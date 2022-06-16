import React from 'react';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const RefuseModal = (props) => {
  const { visible = false, onClose, childRef, loading } = props;
  const { show = false, formProps = {} } = visible;
  const { type = 'refuse', key = 'rejectReason', id } = formProps;

  const [form] = Form.useForm();
  const showProps = { refuse: '拒绝原因', remark: '请填写备注' }[type];
  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: { refuse: 'RefundList/fetchRefundApply' }[type],
        payload: {
          orderRefundApplyId: id,
          ...values,
        },
        callback: () => {
          setVisibleRefuse({ show: false, detail: {} });
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: showProps,
      type: 'textArea',
      name: key,
      maxLength: 50,
    },
  ];

  const modalProps = {
    title: showProps,
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
