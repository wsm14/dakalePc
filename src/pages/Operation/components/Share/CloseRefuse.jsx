import React from 'react';
import { connect } from 'umi';
import { Modal, Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const CloseRefuse = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const { show = false, initialValues = {} } = visible;
  const [form] = Form.useForm();

  // 下架
  const fetchStatusClose = () => {
    form.validateFields().then((payload) => {
      dispatch({
        type: 'shareManage/fetchStatusClose',
        payload: {
          merchantId: initialValues.merchantIdString,
          momentId: initialValues.userMomentIdString,
          ...payload,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '下架原因',
      name: 'removalReason',
      type: 'textArea',
    },
  ];

  const modalProps = {
    title: `下架原因 - ${initialValues.title}`,
    visible: show,
    width: 520,
    onCancel: onClose,
    confirmLoading: loading,
    onOk: fetchStatusClose,
  };

  return (
    <Modal {...modalProps} destroyOnClose>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['shareManage/fetchStatusClose'],
}))(CloseRefuse);
