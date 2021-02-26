import React from 'react';
import { connect } from 'umi';
import { Modal, Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const BusinessAuditRefuse = (props) => {
  const { dispatch, cRef, visible, onClose } = props;
  const { show = false, initialValues = {} } = visible;
  const [form] = Form.useForm();

  // 审核驳回
  const fetchMerSaleAudit = () => {
    form.validateFields().then((payload) => {
      dispatch({
        type: 'businessAudit/fetchMerSaleAudit',
        payload: {
          merchantVerifyId: initialValues.merchantVerifyIdString,
          verifyStatus: 2,
          ...payload,
        },
        callback: () => {
          cRef.current.fetchGetData();
          onClose();
        },
      });
    });
  };

  const formItems = [
    {
      label: '驳回原因',
      name: 'reject_reason',
      type: 'textArea',
    },
  ];

  const modalProps = {
    title: '审核驳回',
    visible: show,
    width: 520,
    onCancel: onClose,
    footer: (
      <Button type="primary" onClick={fetchMerSaleAudit}>
        确定
      </Button>
    ),
  };
  
  return (
    <Modal {...modalProps} destroyOnClose>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </Modal>
  );
};

export default connect(({ businessAudit, loading }) => ({
  businessAudit,
  loading,
}))(BusinessAuditRefuse);
