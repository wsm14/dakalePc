import React from 'react';
import { connect } from 'umi';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const BankChangeRefuse = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;
  const { show = false, ownerBankBindingInfoRecordId } = visible;
  const [form] = Form.useForm();

  // 审核驳回
  const fetchMerSaleAudit = () => {
    form.validateFields().then((payload) => {
      dispatch({
        type: 'bankChangeCheck/fetchAuditBankBindingInfo',
        payload: {
          ownerBankBindingInfoRecordId,
          auditResult: '0',
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
      name: 'rejectReason',
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
  loading: loading.effects['bankChangeCheck/fetchAuditBankBindingInfo'],
}))(BankChangeRefuse);
