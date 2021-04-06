import React from 'react';
import { connect } from 'umi';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const BusinessAuditRefuse = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;
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
    confirmLoading: loading,
    onOk: fetchMerSaleAudit,
  };

  return (
    <Modal {...modalProps} destroyOnClose>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['businessAudit/fetchMerSaleAudit'],
}))(BusinessAuditRefuse);
