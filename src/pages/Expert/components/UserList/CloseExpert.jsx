import React from 'react';
import { connect } from 'umi';
import { Modal, Form } from 'antd';
import { EXPERT_USER_STATUS } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const CloseExpert = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const { show = false, initialValues = {} } = visible;
  const [form] = Form.useForm();

  // 下架
  const fetchExpertStop = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'expertUserList/fetchExpertStop',
        payload: {
          ...initialValues,
          ...values,
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
      label: '封停',
      name: 'suspendStatus',
      type: 'select',
      select: EXPERT_USER_STATUS.map((i) => {
        if (i == '正常') return false;
        return i;
      }),
    },
    {
      label: '封停原因',
      name: 'suspendReason',
      type: 'textArea',
    },
  ];

  const modalProps = {
    title: `封停 - ${initialValues.username}`,
    visible: show,
    width: 520,
    onCancel: onClose,
    confirmLoading: loading,
    onOk: fetchExpertStop,
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
  loading: loading.effects['expertUserList/fetchExpertStop'],
}))(CloseExpert);
